// ——— AUTH & API ———

function getAuth(){try{return JSON.parse(localStorage.getItem('mkn-auth')||'{}')}catch(_){return{}}}
function resvHeaders(){const a=getAuth();return{'Content-Type':'application/json','x-token':a.token||'','x-user':a.name||''}}
async function resvFetch(path,opts={}){
try{const r=await fetch(RESV_API+path,{...opts,headers:{...resvHeaders(),...(opts.headers||{})}});
if(r.status===401){showLogin('Session expired — please sign in again');return null}
if(!r.ok)throw new Error(r.status+' '+r.statusText);return r.json()}
catch(e){console.warn('API:',e.message);return null}}

async function syncFromVPS(){const d=await resvFetch('/api/resv');if(d){if(d.reserved&&d.reserved.length)S.resv.reserved=[...S.resv.reserved.filter(r=>r.src==='file'),...d.reserved.map(r=>({...r,src:'api'}))];if(d.preOrder&&d.preOrder.length)S.resv.preOrder=[...S.resv.preOrder.filter(r=>r.src==='file'),...d.preOrder.map(r=>({...r,src:'api'}))];rResv();if(typeof renderOverview==='function')renderOverview();document.getElementById('st').innerHTML='<span class="ok">Synced '+d.reserved.length+' reserved + '+d.preOrder.length+' pre-orders from server</span>'}}
async function pushResv(entry){return resvFetch('/api/resv',{method:'POST',body:JSON.stringify(entry)})}
async function editResv(id,updates){return resvFetch('/api/resv/'+id,{method:'PUT',body:JSON.stringify(updates)})}
async function deleteResv(id){return resvFetch('/api/resv/'+id,{method:'DELETE'})}
function ensureUser(){return!!_user}

function showLogin(msg){
document.getElementById('loginOverlay').classList.remove('hidden');
document.getElementById('loginErr').textContent=msg||'';
document.getElementById('loginUser').value='';document.getElementById('loginPass').value='';
document.getElementById('loginBtn').disabled=false;document.getElementById('loginBtn').textContent='Sign In';
document.getElementById('userPill').style.display='none'}

function hideLogin(){
document.getElementById('loginOverlay').classList.add('hidden');
const a=getAuth();_user=a.name||'';
document.getElementById('userName').textContent=a.name||'';
document.getElementById('userPill').style.display='flex';
const role=a.role==='ops'?'ops':'mgmt';setRole(role);
setTimeout(loadSnapshot,200)}

async function doLogin(){
const btn=document.getElementById('loginBtn');const err=document.getElementById('loginErr');
const username=document.getElementById('loginUser').value.trim();
const password=document.getElementById('loginPass').value;
if(!username||!password){err.textContent='Enter username and password';return}
btn.disabled=true;btn.textContent='Signing in...';err.textContent='';
try{const r=await fetch(RESV_API+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
const d=await r.json();
if(!r.ok||!d.ok){err.textContent=d.error||'Login failed';btn.disabled=false;btn.textContent='Sign In';return}
localStorage.setItem('mkn-auth',JSON.stringify({token:d.token,role:d.role,name:d.name}));
hideLogin()}
catch(e){err.textContent='Server unreachable — check connection';btn.disabled=false;btn.textContent='Sign In'}}

function doLogout(){
const a=getAuth();
if(a.token)fetch(RESV_API+'/api/auth/logout',{method:'POST',headers:{'x-token':a.token}}).catch(()=>{});
localStorage.removeItem('mkn-auth');showLogin()}

// ——— SNAPSHOT PERSISTENCE ———

async function saveSnapshot(){
const fileMeta={};Object.entries(S.files).forEach(([k,v])=>{if(v&&v.name)fileMeta[k]={name:v.name,date:v.date||null}});
const snap={date:dayjs().format('YYYY-MM-DD'),bt:S.bt,agg:S.agg,desp:S.desp||[],git:S.git||[],resv:{reserved:S.resv.reserved,preOrder:S.resv.preOrder},fileMeta,meta:{brands:Object.keys(S.bt).length,totalStock:Object.values(S.bt).reduce((s,b)=>s+b.ts,0)}};
try{localStorage.setItem('mkn-snapshot',JSON.stringify(snap))}catch(_){}
resvFetch('/api/snapshot',{method:'POST',body:JSON.stringify(snap)}).then(r=>{if(r&&r.ok)console.log('Snapshot saved:',r.date)})}

function applySnapshot(snap){
if(snap.bt)S.bt=snap.bt;if(snap.agg)S.agg=snap.agg;if(snap.desp)S.desp=snap.desp;if(snap.git)S.git=snap.git;
if(snap.resv){if(snap.resv.reserved)S.resv.reserved=snap.resv.reserved;if(snap.resv.preOrder)S.resv.preOrder=snap.resv.preOrder}
S._snapDate=snap.date||null;
if(snap.fileMeta){Object.entries(snap.fileMeta).forEach(([k,v])=>{if(!S.files[k])S.files[k]={};S.files[k].name=v.name;S.files[k].date=v.date})}
if(snap.bt&&!Object.keys(S.sbb||{}).length){S.sbb={};Object.keys(snap.bt).forEach(b=>{S.sbb[b]=snap.bt[b].items||[]})}
if(snap.git&&snap.bt){const vehRe=/^(CHANGAN|AVATR|GEELY|MAXUS|GWM|GREAT WALL|ZNA|DONGFENG|HYUNDAI|LOVOL|FOTON|DFAC)\b/i;const gb={};snap.git.forEach(g=>{if(!vehRe.test(g.name))return;const b=nb(g.name.split(' ')[0]);gb[b]=(gb[b]||0)+Math.max(0,g.tq-g.rq)});Object.keys(S.bt).forEach(b=>{S.bt[b].it=gb[b]||0;S.bt[b].av=Math.max(0,S.bt[b].ts-S.bt[b].rv)})}
document.querySelectorAll('#topNav .nav-btn').forEach(b=>b.classList.remove('disabled'));
rStock();rResv();renderOverview();
nav('overview');
document.getElementById('sr').textContent=(snap.meta?.totalStock||0)+' vehicles \u00b7 '+Object.keys(snap.bt||{}).length+' brands (from snapshot)';
showDataAge(snap.date)}

async function loadSnapshot(){
try{const cached=localStorage.getItem('mkn-snapshot');if(cached){const snap=JSON.parse(cached);applySnapshot(snap);document.getElementById('st').innerHTML='<span class="ok">Loaded from cache ('+snap.date+')</span>'}}catch(_){}
const d=await resvFetch('/api/snapshot/latest');
if(d&&!d.empty){const cached=localStorage.getItem('mkn-snapshot');const cachedDate=cached?JSON.parse(cached).date:null;
if(!cachedDate||d.date>=cachedDate){applySnapshot(d);try{localStorage.setItem('mkn-snapshot',JSON.stringify(d))}catch(_){}
document.getElementById('st').innerHTML='<span class="ok">Synced snapshot ('+d.date+')</span>'}}
syncFromVPS()}

function manualSync(){syncFromVPS().then(()=>{}).catch(()=>{document.getElementById('st').innerHTML='<span style="color:var(--red)">Sync failed — check connection</span>'})}

// ——— RESERVATION FORM ———

function populateDataLists(){
const blDl=document.getElementById('dl-branch');blDl.innerHTML=BRANCHES.map(b=>'<option value="'+b+'">').join('');
const clients=[...new Set([...S.resv.reserved,...S.resv.preOrder].map(r=>r.client).filter(Boolean))];
document.getElementById('dl-client').innerHTML=clients.map(c=>'<option value="'+c+'">').join('');
const sps=[...new Set([...S.resv.reserved,...S.resv.preOrder].map(r=>r.sp).filter(Boolean))];
document.getElementById('dl-sp').innerHTML=sps.map(s=>'<option value="'+s+'">').join('')}

function toggleFormDetails(){const d=document.getElementById('rf-details'),t=document.getElementById('rf-details-toggle');
if(d.style.display==='none'){d.style.display='';t.textContent='- Hide details'}else{d.style.display='none';t.textContent='+ Add details (colour, payment, branch...)'}}
function lockField(id,lock){const el=document.getElementById(id);if(!el)return;el.disabled=lock;if(lock){el.style.color='var(--dim)';el.style.background='var(--bg)'}else{el.style.color='';el.style.background=''}}
function setEditMode(isEdit){
['lock-client','lock-date'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display=isEdit?'inline':'none'});
lockField('rf-client',isEdit);lockField('rf-date',isEdit);
document.getElementById('rf-reason-wrap').style.display=isEdit?'':'none';
if(isEdit){document.getElementById('rf-details').style.display='';document.getElementById('rf-details-toggle').style.display='none'}
else{document.getElementById('rf-details').style.display='none';document.getElementById('rf-details-toggle').style.display=''}}

function openResvModal(){const m=document.getElementById('resvModal');m.classList.add('on');
setEditMode(false);
const sel=document.getElementById('rf-brand');if(sel.options.length<=1){BO.forEach(b=>{const o=document.createElement('option');o.value=b;o.textContent=b;sel.appendChild(o)})}
document.getElementById('rf-date').value=dayjs().format('YYYY-MM-DD');
document.getElementById('rf-pct').textContent='\u2014'}
function closeResvModal(){document.getElementById('resvModal').classList.remove('on')}
function calcPct(){const p=Number(document.getElementById('rf-amtPaid').value)||0,i=Number(document.getElementById('rf-invAmt').value)||0;
const el=document.getElementById('rf-pct');if(i>0&&p>0){const pct=Math.round(p/i*100);el.textContent=pct+'%';el.style.color=pct>=100?'var(--green)':pct>=50?'var(--accent)':'var(--amber)'}else{el.textContent='\u2014';el.style.color=''}}

function saveResv(){const c=document.getElementById('rf-client').value.trim(),br=document.getElementById('rf-brand').value,mo=document.getElementById('rf-model').value.trim(),u=Number(document.getElementById('rf-units').value)||0,st=document.getElementById('rf-status').value;
if(!c||!br||!mo||!u||!st){alert('Fill required fields: Client, Brand, Model, Units, Status');return}
const dt=document.getElementById('rf-date').value;const entry={client:c,branch:document.getElementById('rf-branch').value.trim(),date:dt?new Date(dt):new Date(),days:0,brand:br,model:mo.toUpperCase(),colour:document.getElementById('rf-colour').value.trim().toUpperCase(),units:u,status:st,amtPaid:Number(document.getElementById('rf-amtPaid').value)||0,invAmt:Number(document.getElementById('rf-invAmt').value)||0,payCompDate:document.getElementById('rf-payCompDate').value||'',invStatus:document.getElementById('rf-invStatus').value,sp:document.getElementById('rf-sp').value.trim(),rem:document.getElementById('rf-rem').value.trim(),src:'form'};
if(entry.date){const d=dayjs(entry.date);entry.days=dayjs().diff(d,'day')}
if(entry.invAmt>0&&entry.amtPaid>=entry.invAmt&&!entry.payCompDate){entry.payCompDate=dayjs().format('YYYY-MM-DD')}
if(!ensureUser())return;
entry.src='form';S.resv.reserved.push(entry);closeResvModal();rResv();
pushResv(entry).then(r=>{if(r&&r.id){entry.id=r.id;document.getElementById('st').innerHTML='<span class="ok">Reservation saved &amp; synced ('+_user+')</span>'}else{document.getElementById('st').innerHTML='<span class="ok">Saved locally (offline — will sync later)</span>'}});
['rf-client','rf-branch','rf-model','rf-colour','rf-sp','rf-rem','rf-amtPaid','rf-invAmt','rf-payCompDate'].forEach(id=>{const e=document.getElementById(id);if(e)e.value=''});
document.getElementById('rf-units').value='1';document.getElementById('rf-brand').value='';document.getElementById('rf-status').value='';document.getElementById('rf-invStatus').value='';document.getElementById('rf-pct').textContent='\u2014'}

function buildEntryFromForm(){const c=document.getElementById('rf-client').value.trim(),br=document.getElementById('rf-brand').value,mo=document.getElementById('rf-model').value.trim(),u=Number(document.getElementById('rf-units').value)||0,st=document.getElementById('rf-status').value;
if(!c||!br||!mo||!u||!st){alert('Fill required fields');return null}
const dt=document.getElementById('rf-date').value;return{client:c,branch:document.getElementById('rf-branch').value.trim(),date:dt?new Date(dt):new Date(),brand:br,model:mo.toUpperCase(),colour:document.getElementById('rf-colour').value.trim().toUpperCase(),units:u,status:st,amtPaid:Number(document.getElementById('rf-amtPaid').value)||0,invAmt:Number(document.getElementById('rf-invAmt').value)||0,payCompDate:document.getElementById('rf-payCompDate').value||'',invStatus:document.getElementById('rf-invStatus').value,sp:document.getElementById('rf-sp').value.trim(),rem:document.getElementById('rf-rem').value.trim()}}
function resetModalMode(){const m=document.getElementById('resvModal');delete m.dataset.editId;delete m.dataset.editList;const btn=m.querySelector('.save-resv-btn');if(btn){btn.textContent='Save Reservation';btn.onclick=saveResv}}

function findResvById(id){for(const list of ['reserved','preOrder']){const idx=S.resv[list].findIndex(r=>r.id===id);if(idx!==-1)return{list,idx,record:S.resv[list][idx]}}return null}

function editResvRow(id){if(!ensureUser())return;const f=findResvById(id);if(!f){alert('Record not found');return}
const r=f.record;openResvModal();setEditMode(true);
document.getElementById('resvModal').dataset.origStatus=r.status||'';
document.getElementById('rf-client').value=r.client||'';document.getElementById('rf-branch').value=r.branch||'';document.getElementById('rf-brand').value=r.brand||'';document.getElementById('rf-model').value=r.model||'';document.getElementById('rf-colour').value=r.colour||'';document.getElementById('rf-units').value=r.units||1;document.getElementById('rf-status').value=r.status||'';document.getElementById('rf-sp').value=r.sp||'';document.getElementById('rf-rem').value=r.rem||'';document.getElementById('rf-amtPaid').value=r.amtPaid||'';document.getElementById('rf-invAmt').value=r.invAmt||'';document.getElementById('rf-payCompDate').value=r.payCompDate?dayjs(r.payCompDate).format('YYYY-MM-DD'):'';document.getElementById('rf-invStatus').value=r.invStatus||'';
if(r.date)document.getElementById('rf-date').value=dayjs(r.date).format('YYYY-MM-DD');
calcPct();
const m=document.getElementById('resvModal');m.dataset.editId=id;m.dataset.editList=f.list;
const btn=m.querySelector('.save-resv-btn');if(btn){btn.textContent='Update Reservation';btn.onclick=()=>saveEditResv(id,f.list,f.idx)}}

function saveEditResv(id,list,idx){const entry=buildEntryFromForm();if(!entry)return;
const origStatus=document.getElementById('resvModal').dataset.origStatus||'';
const newStatus=document.getElementById('rf-status').value;
if(origStatus&&newStatus!==origStatus){const reason=document.getElementById('rf-reason').value.trim();if(!reason){alert('Reason is required when changing status');document.getElementById('rf-reason').focus();return}entry.changeReason=reason}
const before={...S.resv[list][idx]};Object.assign(S.resv[list][idx],entry,{id,src:'api',updatedAt:new Date().toISOString(),updatedBy:_user});
closeResvModal();rResv();resetModalMode();
editResv(id,entry).then(r=>{document.getElementById('st').innerHTML=r?'<span class="ok">Updated &amp; synced</span>':'<span class="ok">Updated locally</span>'})}

function deleteResvRow(id,clientName){if(!ensureUser())return;if(!confirm('Remove reservation for '+clientName+'?\n\nThis will be logged and can be recovered.'))return;
const f=findResvById(id);if(!f){alert('Record not found');return}
S.resv[f.list].splice(f.idx,1);rResv();
deleteResv(id).then(r=>{document.getElementById('st').innerHTML=r?'<span class="ok">Removed &amp; synced (logged by '+_user+')</span>':'<span class="ok">Removed locally</span>'})}
