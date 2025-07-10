# 4. Developer Guide

This guide provides instructions for setting up and running the project for development purposes.

## Setup Instructions

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd trello-mcp/trello-mcp/projects/06-crm-role
    ```

2.  **Navigate to the Application Directory**:
    ```bash
    cd operations-flask-app
    ```

3.  **Create and Activate a Virtual Environment**:
    It is highly recommended to use a virtual environment to manage project dependencies.
    ```bash
    # Create the virtual environment
    python3 -m venv venv

    # Activate the virtual environment
    source venv/bin/activate
    ```

4.  **Install Dependencies**:
    Install all required Python packages from the `requirements.txt` file.
    ```bash
    pip install -r requirements.txt
    ```

### Key Dependencies

The main libraries used in this project are:

*   **Flask**: A micro web framework for Python, used to create the main application.
*   **Pandas**: A powerful data manipulation and analysis library, used for the core data processing and cleaning tasks.
*   **NumPy**: A fundamental package for scientific computing with Python, used by Pandas for numerical operations.
*   **openpyxl / xlrd**: Libraries for reading and writing Excel files (`.xlsx` and `.xls` respectively).
*   **Gunicorn**: A Python WSGI HTTP Server for UNIX, often used for deploying Flask applications.

## Running the Application

Once the setup is complete, you can run the main Flask application:
```bash
python app.py
```

## Running Tests

*Note: This section should be updated once a testing framework is formally established.*

Project tests can be run using `pytest`.
```bash
pytest
```
