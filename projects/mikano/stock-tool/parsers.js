// ——— FILE DETECTION & PARSING ———

function det(n,d){const l=n.toLowerCase();if(l.includes('serial_no')||l.includes('ser_no'))return'ser';if(/\bgit\b/.test(l)&&!l.includes('digit'))return'git';if(l.includes('desp_reg')||l.includes('despatch'))return'desp';if(l.endsWith('.csv')||l.includes('sales_summary')||l.includes('e6prod'))return'sales';if(l.includes('reservation'))return'resv';if(l.includes('exec_stock'))return'x';if(l.includes('stock_summary'))return'x';if(d){try{const w=XLSX.read(d,{type:'array',sheetRows:5}),s=w.Sheets[w.SheetNames[0]],a=s['A1']?String(s['A1'].v||''):'';if(a.includes('Serial No Details'))return'ser';if(a.includes('Goods In Transit'))return'git';if(a.includes('Despatch Register'))return'desp'}catch(e){}}return'x'}

function extractDate(name){const fmts=['DD.MM.YYYY','D.M.YYYY','DD_MM_YYYY','DD.MM.YY','D.MM','DD.MM','DD_MM','D_MMM','DD_MMM','YYYYMMDD'];const clean=name.replace(/\.[^.]+$/,'');const d=dayjs(clean,fmts);if(d.isValid())return d.format('DD.MM');const m=name.match(/(\d{1,2})[._](\d{1,2})[._]?/);if(m)return m[1].padStart(2,'0')+'.'+m[2].padStart(2,'0');const m2=name.match(/(\d{1,2})_([A-Z]+)/i);if(m2){const mi=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].indexOf(m2[2].substring(0,3).toUpperCase())+1;if(mi>0)return m2[1].padStart(2,'0')+'.'+(mi+'').padStart(2,'0')}return null}

function hf(files){Array.from(files).forEach(f=>{const r=new FileReader();r.onload=e=>{const d=new Uint8Array(e.target.result),t=det(f.name,d);if(t==='x')return;S.files[t]={name:f.name,data:d,date:extractDate(f.name)};uc()};r.readAsArrayBuffer(f)})}

function rmFile(t,ev){ev.stopPropagation();delete S.files[t];const e=document.getElementById('c-'+t);e.classList.remove('loaded');e.querySelector('.chk-dot').textContent='';const fn=e.querySelector('.fn');if(fn)fn.remove();const db=e.querySelector('.date-badge');if(db)db.remove();uc()}

function uc(){let n=0;const dates=new Set();const fileDates={};['ser','git','desp','sales','resv'].forEach(t=>{const e=document.getElementById('c-'+t);if(S.files[t]){e.classList.add('loaded');e.querySelector('.chk-dot').textContent='\u2713';if(!e.querySelector('.fn')){const d=document.createElement('div');d.className='fn';d.textContent=S.files[t].name;e.querySelector('.chk-lbl').appendChild(d)}if(S.files[t].date){dates.add(S.files[t].date);fileDates[t]=S.files[t].date;if(!e.querySelector('.date-badge')){const db=document.createElement('div');db.className='date-badge';db.textContent='Date: '+S.files[t].date;e.querySelector('.chk-lbl').appendChild(db)}}n++}else{e.classList.remove('loaded');e.querySelector('.chk-dot').textContent='';const fn=e.querySelector('.fn');if(fn)fn.remove();const db=e.querySelector('.date-badge');if(db)db.remove()}});
let majorDate=null;if(dates.size>1){const dc={};Object.values(fileDates).forEach(d=>{dc[d]=(dc[d]||0)+1});majorDate=Object.entries(dc).sort((a,b)=>b[1]-a[1])[0][0]}
['ser','git','desp','sales','resv'].forEach(t=>{const e=document.getElementById('c-'+t);e.classList.remove('date-mismatch');if(majorDate&&fileDates[t]&&fileDates[t]!==majorDate)e.classList.add('date-mismatch')});
document.getElementById('fc').textContent=n;document.getElementById('gb').disabled=!S.files.ser;document.getElementById('st').textContent=S.files.ser?'Ready to generate':'Waiting for Serial No Details';const dw=document.getElementById('dateWarn');dw.classList.toggle('on',dates.size>1)}

// ——— EXCEL PARSERS ———

function pSer(d){const w=XLSX.read(d,{type:'array'}),rows=XLSX.utils.sheet_to_json(w.Sheets[w.SheetNames[0]],{header:1,defval:''});let h=rows.findIndex(r=>r.some(c=>String(c).includes('Warehouse')));if(h<0)h=2;const items=[];for(let i=h+1;i<rows.length;i++){const r=rows[i];if(!r[0]&&!r[7])continue;items.push({wh:str(r[0]),brand:str(r[12]).toUpperCase(),model:str(r[7]).toUpperCase(),colour:str(r[8]).toUpperCase(),trim:str(r[11]).toUpperCase(),type:str(r[13]),desc:str(r[5]),vin:str(r[15]),ic:str(r[3])})}return items}

function pGIT(d){const w=XLSX.read(d,{type:'array'}),rows=XLSX.utils.sheet_to_json(w.Sheets[w.SheetNames[0]],{header:1,defval:''});let h=rows.findIndex(r=>r.some(c=>String(c).includes('Despatched')));if(h<0)h=2;const items=[];for(let i=h+1;i<rows.length;i++){const r=rows[i];if(!r[7]&&!r[8])continue;items.push({ic:str(r[7]),name:str(r[8]),tq:nm(r[9]),rq:nm(r[10])})}return items}

function pDesp(d){const w=XLSX.read(d,{type:'array'}),rows=XLSX.utils.sheet_to_json(w.Sheets[w.SheetNames[0]],{header:1,defval:''});let h=rows.findIndex(r=>r.some(c=>String(c).includes('Branch Name')));if(h<0)h=2;const items=[];for(let i=h+1;i<rows.length;i++){const r=rows[i];if(!r[2]&&!r[3])continue;items.push({br:str(r[0]),cust:str(r[1]),ic:str(r[2]),desc:str(r[3]),qty:nm(r[9])})}return items}

function pSales(d){const w=XLSX.read(d,{type:'array'}),rows=XLSX.utils.sheet_to_json(w.Sheets[w.SheetNames[0]],{header:1,defval:''});let h=rows.findIndex(r=>r.some(c=>String(c).toString().includes('BRANCH')));if(h<0)h=0;const items=[];for(let i=h+1;i<rows.length;i++){const r=rows[i];if(!r[0])continue;items.push({br:str(r[0]),brand:str(r[5]).toUpperCase(),model:str(r[10]).toUpperCase(),colour:str(r[11]).toUpperCase(),qty:nm(r[16]),btype:str(r[18]),rep:str(r[20])})}return items}

function pResv(d){const w=XLSX.read(d,{type:'array',cellDates:true}),res={reserved:[],preOrder:[]};const parse=(sn,tgt,sc)=>{const ws=w.Sheets[sn];if(!ws)return;const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});let h=rows.findIndex(r=>r.some(c=>String(c).includes('CLIENT NAME')));if(h<0)h=1;for(let i=h+1;i<rows.length;i++){const r=rows[i];if(!r[0])continue;tgt.push({client:str(r[0]),branch:str(r[1]),date:r[2],days:nm(r[3]),brand:str(r[4]).toUpperCase(),model:str(r[5]),colour:str(r[6]),units:nm(r[7]),status:str(r[8]),amtPaid:nm(r[9]),invAmt:nm(r[10]),payCompDate:r[11]||'',invStatus:str(r[12]),sp:str(r[sc]),rem:str(r[sc+1]),src:'file'})}};parse('Reserved (updated)',res.reserved,13);if(!w.Sheets['Reserved (updated)'])parse('Reserved',res.reserved,13);parse('Pre-Order',res.preOrder,12);return res}

// ——— COMPILATION ———

function compile(){S.sbb={};S.ser.forEach(i=>{const b=nb(i.brand);if(!S.sbb[b])S.sbb[b]=[];S.sbb[b].push(i)});
S.agg={};Object.entries(S.sbb).forEach(([b,items])=>{const a={};items.forEach(i=>{const k=i.model+'||'+i.trim+'||'+i.colour;if(!a[k])a[k]={model:i.model,trim:i.trim,colour:i.colour,qty:0};a[k].qty++});S.agg[b]=Object.values(a).sort((a,b)=>a.model.localeCompare(b.model)||a.trim.localeCompare(b.trim))});
const rb={};[...S.resv.reserved,...S.resv.preOrder].forEach(r=>{const b=nb(r.brand);rb[b]=(rb[b]||0)+r.units});
const vehRe=/^(CHANGAN|AVATR|GEELY|MAXUS|GWM|GREAT WALL|ZNA|DONGFENG|HYUNDAI|LOVOL|FOTON|DFAC)\b/i;
const gb={};S.git.forEach(g=>{if(!vehRe.test(g.name))return;const b=nb(g.name.split(' ')[0]);gb[b]=(gb[b]||0)+Math.max(0,g.tq-g.rq)});
S.bt={};[...new Set([...Object.keys(S.agg),...BO])].forEach(b=>{const items=S.agg[b]||[];const ts=items.reduce((s,i)=>s+i.qty,0);const rv=rb[b]||0;const it=gb[b]||0;const av=Math.max(0,ts-rv);if(ts>0||rv>0||it>0)S.bt[b]={ts,rv,wip:0,av,it,items}})}

// ——— GENERATE (orchestrates parse + compile + render) ———

async function gen(){const lo=document.getElementById('lo'),ls=document.getElementById('loS'),lt=document.querySelector('.lo-t');lo.classList.add('on');
const steps=[];if(S.files.ser)steps.push({l:'Parsing Serial No Details...',fn:()=>{S.ser=pSer(S.files.ser.data)}});
if(S.files.git)steps.push({l:'Parsing Goods in Transit...',fn:()=>{S.git=pGIT(S.files.git.data);const fg=S.git.filter(g=>g.ic.startsWith('FG'));const nonFg=S.git.filter(g=>!g.ic.startsWith('FG'));console.table({total:{items:S.git.length,units:S.git.reduce((s,g)=>s+Math.max(0,g.tq-g.rq),0)},FG:{items:fg.length,units:fg.reduce((s,g)=>s+Math.max(0,g.tq-g.rq),0)},nonFG:{items:nonFg.length,units:nonFg.reduce((s,g)=>s+Math.max(0,g.tq-g.rq),0)}});console.log('Non-FG items:',nonFg.map(g=>g.ic+' | '+g.name+' | '+(g.tq-g.rq)))}});
if(S.files.desp)steps.push({l:'Parsing Despatch Register...',fn:()=>{S.desp=pDesp(S.files.desp.data)}});
if(S.files.sales)steps.push({l:'Parsing Sales Summary...',fn:()=>{S.sales=pSales(S.files.sales.data)}});
if(S.files.resv)steps.push({l:'Parsing Reservations...',fn:()=>{S.resv=pResv(S.files.resv.data)}});
steps.push({l:'Compiling stock by brand...',fn:compile});
steps.push({l:'Rendering views...',fn:()=>{rStock();rResv();rAlerts();populateDataLists();renderOverview()}});
for(let i=0;i<steps.length;i++){lt.textContent=`Step ${i+1} of ${steps.length}`;ls.textContent=steps[i].l;await tk();try{steps[i].fn()}catch(e){ls.textContent='Error: '+e.message;console.error(e);await new Promise(r=>setTimeout(r,3000));lo.classList.remove('on');return}if(i===0&&S.ser.length)ls.textContent=S.ser.length+' vehicles found';await tk()}
document.querySelectorAll('#topNav .nav-btn').forEach(b=>b.classList.remove('disabled'));
S._genTs=Date.now();
lo.classList.remove('on');nav('overview');
document.getElementById('st').innerHTML='<span class="ok">Reports generated</span>';document.getElementById('sr').textContent=S.ser.length+' vehicles \u00b7 '+Object.keys(S.bt).length+' brands';
if(typeof saveSnapshot==='function')saveSnapshot()}
