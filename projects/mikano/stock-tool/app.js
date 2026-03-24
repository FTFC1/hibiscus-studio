// ——— APP INIT & EVENT WIRING ———

// Date pill
const dpEl=document.getElementById('dp');if(dpEl)dpEl.textContent=new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'});

// Drop zone
const dz=document.getElementById('dz'),fi=document.getElementById('fi');
dz.addEventListener('click',()=>fi.click());
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('over')});
dz.addEventListener('dragleave',()=>dz.classList.remove('over'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('over');hf(e.dataTransfer.files)});
fi.addEventListener('change',()=>hf(fi.files));

// Nav buttons
document.querySelectorAll('#topNav .nav-btn').forEach(b=>{
b.addEventListener('click',()=>{if(!b.classList.contains('disabled'))nav(b.dataset.v)})});

// Brand select cascade
document.getElementById('rf-brand').addEventListener('change',function(){
const b=this.value,items=S.agg[b]||[];
const models=[...new Set(items.map(i=>i.model))];
document.getElementById('dl-model').innerHTML=models.map(m=>'<option value="'+m+'">').join('');
const colours=[...new Set(items.map(i=>i.colour).filter(Boolean))];
document.getElementById('dl-colour').innerHTML=colours.map(c=>'<option value="'+c+'">').join('');
document.getElementById('rf-model').value='';document.getElementById('rf-colour').value=''});

// Login keyboard shortcuts
document.getElementById('loginPass').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin()});
document.getElementById('loginUser').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('loginPass').focus()});

// Global keyboard shortcuts
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeResvModal();resetModalMode();closeDetailModal()}});

// Stock view: hook into render + resize
const _origRStock=rStock;
rStock=function(){_origRStock();if(_stockDetailBrand&&window.innerWidth>=1024){renderStockDetail(_stockDetailBrand)}renderStockSidebar()};
window.addEventListener('resize',()=>{if(document.getElementById('vStock').classList.contains('active')){if(window.innerWidth<1024&&_stockDetailBrand){renderStockDefault()}renderStockSidebar()}});

// Init role toggle
(function initRole(){
document.querySelectorAll('.role-btn').forEach(b=>{b.classList.toggle('active',b.dataset.role===currentRole)});
})();

// Init bottom nav
renderBottomNav('overview');

// Auth check on page load
(async function checkAuth(){
const a=getAuth();
if(!a.token){showLogin();return}
try{const r=await fetch(RESV_API+'/api/auth/check',{headers:{'x-token':a.token}});
if(r.ok){hideLogin()}
else{showLogin('Session expired \u2014 please sign in again')}}
catch(e){
_user=a.name||'';
document.getElementById('userName').textContent=a.name||'';
document.getElementById('userPill').style.display='flex';
document.getElementById('loginOverlay').classList.add('hidden');
document.getElementById('offlineBanner').classList.add('on');
const role=a.role==='ops'?'ops':'mgmt';setRole(role)}
})();

// Load snapshot after brief delay
setTimeout(loadSnapshot,500);
