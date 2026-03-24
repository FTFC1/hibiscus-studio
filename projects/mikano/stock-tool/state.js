// ——— GLOBAL STATE & CONSTANTS ———
const S={files:{},ser:[],git:[],desp:[],sales:[],resv:{reserved:[],preOrder:[]},sbb:{},agg:{},bt:{},abf:'all'};
const BO=['CHANGAN','AVATR','GEELY','MAXUS','GWM','ZNA','HYUNDAI','LOVOL','FOTON','DFAC','KMC','DINGZHOU'];
const MO=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const BRAND_CAT={CHANGAN:'Passenger',AVATR:'Passenger',GEELY:'Passenger',GWM:'Passenger',MAXUS:'Commercial',FOTON:'Commercial',ZNA:'Commercial',DFAC:'Commercial',KMC:'Commercial',HYUNDAI:'Commercial',DINGZHOU:'Commercial',LOVOL:'Equipment'};
const BRANCHES=['Ikeja','Victoria Island','Lekki','Apapa','Ibadan','Abuja','Port Harcourt','Kano'];
const RESV_API='https://46.225.137.63';

// Vehicle enrichment data (keyed by model name as it appears in ERP)
const VEHICLE_DATA={
'CS55 PLUS':{
tagline:'Smart, Connected SUV',
specs:{engine:'1.5T',power:'181hp',transmission:'7DCT',fuel:'Petrol',seats:'5',drive:'FWD'},
brochure:'',
images:[],
features:['360\u00b0 Camera','Wireless Charging','LED Matrix Headlights'],
price_range:''},
'HUNTER':{
tagline:'Built for Nigerian Roads',
specs:{engine:'2.0T',power:'233hp',transmission:'8AT',fuel:'Petrol',seats:'5',drive:'4WD'},
brochure:'',
images:[],
features:['Off-road Mode','Towing 2.5T'],
price_range:''}
};

// ——— SHARED MUTABLE STATE ———
let stockTable=null;
let _sf={brand:'',model:'',trim:'',colour:''};
let _cascading=false;
let alertFilter=null;
const alertDismissed=new Set();
let _rtf='all';
let _resvSort='days';
let currentRole=localStorage.getItem('mikano-stock-role')||'mgmt';
let _user='';
let _tipEl=null;
let _stockDetailBrand='';
let _sdModelFilter=[];
let _sdModels={};

// ——— UTILITY FUNCTIONS ———
function str(v){return String(v||'').trim()}
function nm(v){return Number(v)||0}
function nb(b){const u=String(b||'').trim().toUpperCase();if(u.includes('CHANGAN'))return'CHANGAN';if(u.includes('AVATR'))return'AVATR';if(u.includes('GEELY'))return'GEELY';if(u.includes('MAXUS'))return'MAXUS';if(u.includes('GWM')||u.includes('GREAT WALL'))return'GWM';if(u.includes('ZNA')||u.includes('DONGFENG'))return'ZNA';if(u.includes('HYUNDAI'))return'HYUNDAI';if(u.includes('LOVOL'))return'LOVOL';if(u.includes('FOTON'))return'FOTON';if(u.includes('DFAC'))return'DFAC';return u||'OTHER'}
function sb(o){return Object.keys(o).sort((a,b)=>{const ia=BO.indexOf(a),ib=BO.indexOf(b);return(ia<0?99:ia)-(ib<0?99:ib)})}
function p2(n){return String(n).padStart(2,'0')}
function fd(d){return d instanceof Date?d.toLocaleDateString('en-GB'):String(d||'')}
function tk(){return new Promise(r=>setTimeout(r,200))}
function statusChip(s){const sl=String(s||'').toLowerCase();if(sl.includes('full'))return'<span class="status-chip sc-full">Full Payment</span>';if(sl.includes('deposit')||sl.includes('part'))return'<span class="status-chip sc-deposit">Deposit</span>';if(sl.includes('lpo'))return'<span class="status-chip sc-lpo">LPO</span>';if(sl.includes('management'))return'<span class="status-chip sc-mgmt">Management</span>';if(sl.includes('chairman'))return'<span class="status-chip sc-chairman">Chairman</span>';if(sl.includes('ceo'))return'<span class="status-chip sc-ceo">CEO</span>';return'<span class="status-chip" style="background:var(--s2);color:var(--muted)">'+s+'</span>'}
function pctBar(paid,inv){if(!inv||inv<=0)return'';const pct=Math.min(100,Math.round(paid/inv*100));const c=pct>=100?'var(--green)':pct>=50?'var(--accent)':'var(--amber)';return'<div style="display:flex;align-items:center;gap:6px;font-size:11px"><div class="pct-bar" style="width:60px"><div class="pct-fill" style="width:'+pct+'%;background:'+c+'"></div></div><span style="color:'+c+';font-weight:600;font-family:SF Mono,monospace">'+pct+'%</span></div>'}
function fuzzyMatch(q,text){if(!q)return true;const strip=s=>s.replace(/[^a-z0-9]/gi,'').toLowerCase();const sq=strip(q),st=strip(text);if(st.includes(sq))return true;const norm=s=>s.replace(/[-_./]/g,' ').toLowerCase();const words=norm(q).split(/\s+/).filter(Boolean);return words.every(w=>norm(text).includes(w))}
