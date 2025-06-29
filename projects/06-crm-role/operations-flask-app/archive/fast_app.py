from flask import Flask, request, render_template, send_file, flash, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, EqualTo, ValidationError
from werkzeug.security import generate_password_hash, check_password_hash
import pandas as pd
import os
from datetime import datetime
from werkzeug.utils import secure_filename
import time
import logging
from logging.handlers import RotatingFileHandler

# Import the new, clean processor function
from processor import process_uploaded_file

# --- Logging Setup ---
log_formatter = logging.Formatter('%(asctime)s %(levelname)s %(funcName)s(%(lineno)d) %(message)s')
logFile = 'vininspector.log'
my_handler = RotatingFileHandler(logFile, mode='a', maxBytes=5*1024*1024, backupCount=2, encoding=None, delay=0)
my_handler.setFormatter(log_formatter)
my_handler.setLevel(logging.INFO)
app_log = logging.getLogger('root')
app_log.setLevel(logging.INFO)
app_log.addHandler(my_handler)

# --- App Initialization ---
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'a_default_secret_key_for_development')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'Files/output'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

# --- Models and Forms ---
@login_manager.user_loader
def load_user(user_id):
    return db.session.get(User, int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class RegistrationForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

    def validate_email(self, email):
        allowed_domains = ["mikano-intl.com", "mikanomotors.com"]
        email_address = email.data.strip().lower()
        if '@' not in email_address or email_address.split('@')[-1] not in allowed_domains:
            raise ValidationError('Registration is only for @mikano-intl.com and @mikanomotors.com emails.')
        if User.query.filter_by(email=email_address).first():
            raise ValidationError('That email is already taken.')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

# --- Helper Functions ---
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'xls', 'xlsx'}

# --- Core Routes ---
@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/home')
@login_required
def home():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
@login_required
def process_file_route():
    if 'file' not in request.files:
        flash('No file part', 'danger')
        return redirect(url_for('home'))

    file = request.files['file']

    if file.filename == '':
        flash('No selected file', 'danger')
        return redirect(url_for('home'))
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(upload_path)
        
        try:
            start_time = time.time()
            clean_df = process_uploaded_file(upload_path)
            processing_time = time.time() - start_time
            app_log.info(f"File '{filename}' processed in {processing_time:.2f}s.")

            # --- Prepare results for the template ---
            results = {
                'processing_time': round(processing_time, 2),
                'total_vehicles': len(clean_df),
                'rows_json': clean_df.to_json(orient='records')
            }
            brand_summary = clean_df['Brand'].value_counts().to_dict()
            all_brands = ['Changan', 'Maxus', 'Geely', 'Hyundai Forklifts', 'GWM', 'ZNA']
            for brand in all_brands:
                count = brand_summary.get(brand, 0)
                # Use a key that is safe for html attributes and js variables
                key = brand.lower().replace(" ", "")
                results[f'{key}_count'] = count
                unique_vins = clean_df[clean_df['Brand'] == brand]['VIN'].nunique() if count > 0 else 0
                results[f'{key}_unique_vins'] = unique_vins

            # --- Create and save the Excel report ---
            output_filename = f"Vehicle_Dispatch_Report_{datetime.now().strftime('%B_%Y')}.xlsx"
            report_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
            with pd.ExcelWriter(report_path, engine='openpyxl') as writer:
                for brand_name in all_brands:
                    brand_df = clean_df[clean_df['Brand'] == brand_name]
                    if not brand_df.empty:
                        brand_df.to_excel(writer, sheet_name=brand_name, index=False)
            results['output_file'] = output_filename
            
            return render_template('results.html', results=results, title="Processing Results")

        except (ValueError, KeyError) as e:
            app_log.error(f"Processing error for {filename}: {e}", exc_info=True)
            flash(f'Error processing file: {e}', 'danger')
            return redirect(url_for('home'))
        except Exception as e:
            app_log.error(f"An unexpected error occurred for {filename}: {e}", exc_info=True)
            flash('An unexpected server error occurred. Please try again.', 'danger')
            return redirect(url_for('home'))
            
    else:
        flash('Invalid file type. Please upload an Excel file (.xls, .xlsx).', 'warning')
        return redirect(url_for('home'))

# Alias route for backward compatibility
@app.route('/upload', methods=['POST'])
@login_required
def upload_file_route():
    """Alias for /process to maintain compatibility with older templates/scripts."""
    return process_file_route()

# --- Auth Routes ---
@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data.strip()).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            return redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check email and password', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(email=form.email.data.strip())
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You can now log in.', 'success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

# --- File Download Route ---
@app.route('/download/<filename>')
@login_required
def download_file(filename):
    return send_file(os.path.join(app.config['OUTPUT_FOLDER'], filename), as_attachment=True)

# --- App Context and Startup ---
@app.context_processor
def inject_time():
    return dict(time=time)

if __name__ == '__main__':
    with app.app_context():
        # Create folders if they don't exist
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)
        db.create_all()
    app.run(host='0.0.0.0', port=5100, debug=True) 