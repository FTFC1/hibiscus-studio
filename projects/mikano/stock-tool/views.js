// ——— NAVIGATION ———

function nav(v){document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));document.querySelectorAll('#topNav .nav-btn').forEach(x=>x.classList.remove('active'));const t=document.getElementById('v'+v.charAt(0).toUpperCase()+v.slice(1));if(t)t.classList.add('active');const b=document.querySelector(`#topNav .nav-btn[data-v="${v}"]`);if(b)b.classList.add('active');renderBottomNav(v);window.scrollTo(0,0)}
function brandCardNav(brand){nav('stock');if(window.innerWidth>=1024){_stockDetailBrand=brand;_sdModelFilter=[];renderStockDetail(brand);renderStockSidebar()}else{stockChipClick('brand',brand);setTimeout(renderStockMobileList,100)}}

// ——— ALERT PILLS ———

function rAlerts(){
  const strip=document.getElementById('alertStrip');
  const alerts=[];
  const fileTs=Object.values(S.files).map(f=>f.date).filter(Boolean);
  if(S._genTs){
    const ageH=Math.round((Date.now()-S._genTs)/3600000);
    if(ageH>=6)alerts.push({id:'stale',cls:'al-crit',n:ageH+'h',l:'Data age',filter:'stale'});
  }
  const allResv=[...S.resv.reserved,...S.resv.preOrder];
  const overdue=allResv.filter(r=>r.days>90);
  if(overdue.length)alerts.push({id:'overdue',cls:'al-warn',n:overdue.length,l:'Overdue',filter:'overdue'});
  const stockouts=Object.entries(S.bt).filter(([b,d])=>d.av===0&&d.rv>0);
  if(stockouts.length)alerts.push({id:'stockout',cls:'al-crit',n:stockouts.length,l:'Stockout',filter:'stockout'});
  const vehRe=/^(CHANGAN|AVATR|GEELY|MAXUS|GWM|GREAT WALL|ZNA|DONGFENG|HYUNDAI|LOVOL|FOTON|DFAC|MIKANO|DFM|KMC|FAW|NISSAN|DINGZHOU)\b/i;
  const transitTotal=(S.git||[]).filter(g=>vehRe.test(g.name)).reduce((s,g)=>s+Math.max(0,g.tq-g.rq),0);
  if(transitTotal>0)alerts.push({id:'transit',cls:'al-info',n:transitTotal,l:'In transit',filter:'transit'});
  const paid=allResv.filter(r=>r.amtPaid>0&&r.invAmt>0&&r.amtPaid>=r.invAmt);
  if(paid.length)alerts.push({id:'paid',cls:'al-good',n:paid.length,l:'Paid 100%',filter:'paid'});
  const visible=alerts.filter(a=>!alertDismissed.has(a.id));
  if(!visible.length){strip.classList.remove('on');strip.innerHTML='';return}
  strip.classList.add('on');
  strip.innerHTML=visible.map(a=>{
    const sel=alertFilter===a.filter?' al-sel':'';
    return`<div class="al-pill ${a.cls}${sel}" onclick="toggleAlertFilter('${a.filter}')" tabindex="0" role="button"><span class="al-n">${a.n}</span><span class="al-l">${a.l}</span></div>`}).join('')}

function toggleAlertFilter(filter){
  const fbar=document.getElementById('alertFbar');
  const ftext=document.getElementById('alertFbarText');
  if(alertFilter===filter){alertFilter=null;fbar.classList.remove('on');rAlerts();rResv();renderOverview();rStock();return}
  alertFilter=filter;
  const msgs={stale:'Data is stale \u2014 upload fresh files',overdue:'Reservations >90 days',stockout:'Brands with 0 available',transit:'Units in transit',paid:'Payments complete (100%)'};
  ftext.textContent='Filtered: '+msgs[filter];fbar.classList.add('on');
  rAlerts();rResv();renderOverview();rStock()}
function clearAlertFilter(){alertFilter=null;document.getElementById('alertFbar').classList.remove('on');rAlerts();rResv();renderOverview();rStock()}

// ——— STOCK VIEW ———

function _sfSet(field,val){if(!stockTable)return;_sf[field]=val||'';stockTable.setFilter(_sfBuild())}
function _sfBuild(){const f=[];if(_sf.brand)f.push({field:'brand',type:'=',value:_sf.brand});if(_sf.model)f.push({field:'model',type:'=',value:_sf.model});if(_sf.trim)f.push({field:'trim',type:'=',value:_sf.trim});if(_sf.colour)f.push({field:'colour',type:'=',value:_sf.colour});return f}

function renderBrandChips(){if(!stockTable)return;const all=stockTable.getData();const allCounts={};let totalAll=0;all.forEach(r=>{allCounts[r.brand]=(allCounts[r.brand]||0)+r.qty;totalAll+=r.qty});const brands=sb(allCounts);let h=`<button type="button" class="bchip${!_sf.brand?' active':''}" aria-pressed="${!_sf.brand}" onclick="stockChipClick('brand','')">All<span class="cnt">${totalAll}</span></button>`;brands.forEach(b=>{const c=allCounts[b]||0;h+=`<button type="button" class="bchip${_sf.brand===b?' active':''}" aria-pressed="${_sf.brand===b}" onclick="stockChipClick('brand','${b}')">${b}<span class="cnt">${c}</span></button>`});document.getElementById('brandChips').innerHTML=h}

function renderCascadeChips(){if(!stockTable)return;const active=stockTable.getData('active');
const mr=document.getElementById('modelChipRow');if(_sf.brand){const mc={};active.forEach(r=>{mc[r.model]=(mc[r.model]||0)+r.qty});const models=Object.entries(mc).sort((a,b)=>b[1]-a[1]).map(([k])=>k);let h='';models.forEach(m=>{h+=`<button type="button" class="bchip${_sf.model===m?' active':''}" aria-pressed="${_sf.model===m}" onclick="stockChipClick('model','${m}')">${m}<span class="cnt">${mc[m]}</span></button>`});document.getElementById('modelChips').innerHTML=h;mr.classList.add('on')}else{mr.classList.remove('on')}
const tr=document.getElementById('trimChipRow');if(_sf.brand&&_sf.model){const tc={};active.forEach(r=>{tc[r.trim]=(tc[r.trim]||0)+r.qty});const trims=Object.keys(tc).sort();let h='';trims.forEach(t=>{h+=`<button type="button" class="bchip${_sf.trim===t?' active':''}" aria-pressed="${_sf.trim===t}" onclick="stockChipClick('trim','${t}')">${t}<span class="cnt">${tc[t]}</span></button>`});document.getElementById('trimChips').innerHTML=h;tr.classList.add('on')}else{tr.classList.remove('on')}
const cr=document.getElementById('colourChipRow');if(_sf.brand&&_sf.model){const cc={};active.forEach(r=>{cc[r.colour]=(cc[r.colour]||0)+r.qty});const colours=Object.keys(cc).sort();let h='';colours.forEach(c=>{h+=`<button type="button" class="bchip${_sf.colour===c?' active':''}" aria-pressed="${_sf.colour===c}" onclick="stockChipClick('colour','${c}')">${c}<span class="cnt">${cc[c]}</span></button>`});document.getElementById('colourChips').innerHTML=h;cr.classList.add('on')}else{cr.classList.remove('on')}}

function stockChipClick(field,val){if(!stockTable)return;const cur=_sf[field];const newVal=cur===val?'':val;
_cascading=true;
if(field==='brand'){_sf={brand:newVal,model:'',trim:'',colour:''};}
else if(field==='model'){_sf.model=newVal;_sf.trim='';_sf.colour='';}
else if(field==='trim'){_sf.trim=newVal;_sf.colour='';}
else{_sf[field]=newVal;}
stockTable.setFilter(_sfBuild());
try{stockTable.getGroups().forEach(g=>{if(_sf.brand)g.show();else g.hide()})}catch(e){}
_cascading=false;
renderBrandChips();renderCascadeChips();renderActiveFilterBar();renderStockMobileList()}
function stockFilterBrand(b){stockChipClick('brand',b)}

function renderActiveFilterBar(){const entries=Object.entries(_sf).filter(([k,v])=>v);const qtyVal=stockTable?stockTable.getColumn('qty').getHeaderFilterValue():'';const hasQty=!!(qtyVal&&Number(qtyVal)>0);const el=document.getElementById('activeFilters');if(entries.length===0&&!hasQty){el.classList.remove('on');el.innerHTML='';updateStockCount();return}el.classList.add('on');let h='<span class="af-label">Filtered</span>';entries.forEach(([field,val])=>{const label=field.charAt(0).toUpperCase()+field.slice(1);h+=`<span class="af-chip">${label}: ${val}<span class="af-x" onclick="stockChipClick('${field}','')">&times;</span></span>`});if(hasQty)h+=`<span class="af-chip">Qty \u2265 ${qtyVal}<span class="af-x" onclick="clearQtyFilter()">&times;</span></span>`;if(entries.length+(hasQty?1:0)>=2)h+=`<span class="af-clear" onclick="stockClearAll()">Clear all</span>`;el.innerHTML=h;updateStockCount()}
function clearQtyFilter(){if(!stockTable)return;stockTable.getColumn('qty').setHeaderFilterValue('')}
function updateStockCount(){if(!stockTable)return;const total=stockTable.getData().length;const filtered=stockTable.getData('active').length;const st=document.getElementById('st');if(filtered<total){st.innerHTML='Filtered \xb7 <strong style="color:var(--text)">'+filtered+'</strong> of '+total+' vehicles'}else{st.textContent='Ready'}}
function updateActiveFilters(){if(!stockTable||_cascading)return;renderBrandChips();renderCascadeChips();renderActiveFilterBar();try{stockTable.getGroups().forEach(g=>{if(_sf.brand)g.show();else g.hide()})}catch(e){}renderStockMobileList()}
function stockClearAll(){if(!stockTable)return;_sf={brand:'',model:'',trim:'',colour:''};stockTable.clearFilter();stockTable.clearHeaderFilter();try{stockTable.getGroups().forEach(g=>g.hide())}catch(e){}renderBrandChips();renderCascadeChips();renderActiveFilterBar();renderStockMobileList()}

function rStock(){const rows=[];sb(S.agg).forEach(b=>{(S.agg[b]||[]).forEach(i=>{rows.push({brand:b,model:i.model,trim:i.trim,colour:i.colour,qty:i.qty})})});
if(stockTable){stockTable.replaceData(rows);renderBrandChips();renderCascadeChips();renderStockMobileList();return}
stockTable=new Tabulator('#stockTab',{data:rows,layout:'fitColumns',height:'70vh',renderVertical:'virtual',placeholder:'No stock data loaded',columns:[{title:'Brand',field:'brand',visible:false},{title:'Model',field:'model',width:170},{title:'Trim',field:'trim'},{title:'Colour',field:'colour'},{title:'Qty',field:'qty',hozAlign:'right',headerFilter:'number',headerFilterPlaceholder:'min',headerFilterFunc:'>=',width:80,bottomCalc:'sum',formatter:function(cell){const v=cell.getValue();return v===0?'<span style="color:var(--dim)">0</span>':v}}],groupBy:'brand',groupStartOpen:false,groupHeader:function(value,count,data){const tot=data.reduce((s,r)=>s+r.qty,0);return'<span style="font-weight:700;letter-spacing:.5px">'+value+'</span><span style="color:var(--accent);font-size:12px;font-weight:600;margin-left:10px;font-family:SF Mono,monospace">'+tot+'</span><span style="color:var(--dim);font-size:10px;margin-left:4px">units</span>'},initialSort:[{column:'brand',dir:'asc'},{column:'model',dir:'asc'}]});stockTable.on('dataFiltered',updateActiveFilters);stockTable.on('tableBuilt',()=>{if(window.innerWidth<=600){stockTable.hideColumn('trim');stockTable.hideColumn('colour')}renderStockMobileList()});const _mObsEl=document.getElementById('stockTab');window._mObs=new ResizeObserver(()=>{if(!stockTable)return;if(window.innerWidth<=600){stockTable.hideColumn('trim');stockTable.hideColumn('colour')}else{stockTable.showColumn('trim');stockTable.showColumn('colour')}});window._mObs.observe(_mObsEl);renderBrandChips()}

// ——— MOBILE STOCK LIST ———

function renderStockMobileList(){
const el=document.getElementById('stockMobileList');
if(!el||window.innerWidth>600)return;
if(!stockTable){el.innerHTML='';return}
const rows=stockTable.getData('active');
const groups={};rows.forEach(r=>{if(!groups[r.brand])groups[r.brand]={qty:0,models:{}};groups[r.brand].qty+=r.qty;if(!groups[r.brand].models[r.model])groups[r.brand].models[r.model]={qty:0,items:[]};groups[r.brand].models[r.model].qty+=r.qty;groups[r.brand].models[r.model].items.push(r)});
const brandNames=Object.keys(groups).sort();
const singleBrand=brandNames.length===1;
let h='';
brandNames.forEach(b=>{const g=groups[b];
if(!singleBrand){
h+=`<div class="stk-group open" onclick="this.classList.toggle('open')"><div style="display:flex;align-items:center;gap:8px"><span class="stk-group-arrow">\u25B6</span><span class="stk-group-name">${b}</span></div><div class="stk-group-count">${g.qty}<span>units</span></div></div>`;
h+='<div class="stk-items">';}
const modelNames=Object.keys(g.models).sort();
modelNames.forEach(m=>{const md=g.models[m];
const subs=md.items.map(i=>[i.trim,i.colour].filter(Boolean).join(' \u00b7 ')).filter((v,i,a)=>a.indexOf(v)===i);
const subText=subs.length<=2?subs.join(', '):subs.slice(0,2).join(', ')+` +${subs.length-2}`;
h+=`<div class="stk-item" onclick="mobileOpenModel('${m.replace(/'/g,"\\'")}','${b.replace(/'/g,"\\'")}')">`;
h+=`<div class="stk-item-left"><div class="stk-item-name">${m}</div>`;
if(subText)h+=`<div class="stk-item-sub">${subText}</div>`;
h+='</div>';
h+=`<div class="stk-badge${md.qty===0?' zero':''}">${md.qty}</div></div>`});
if(!singleBrand)h+='</div>';
});
if(!h)h='<div style="padding:20px;color:var(--dim);text-align:center">No stock matches</div>';
el.innerHTML=h}
function mobileOpenModel(model,brand){
if(!stockTable)return;
const rows=stockTable.getData('active').filter(r=>r.model===model&&r.brand===brand);
openVehicleDetail(model,brand,rows)}

// ——— DESKTOP TWO-COLUMN STOCK ———

function renderStockSidebar(){
const sb2=document.getElementById('stockSidebar'),tc=document.getElementById('stockTwoCol');
if(window.innerWidth<1024){sb2.style.display='none';tc.className='';_stockDetailBrand='';return}
sb2.style.display='';tc.className='stock-two-col';
const brands=sb(S.bt);const cats={Passenger:[],Commercial:[],Equipment:[]};
brands.forEach(b=>{const cat=BRAND_CAT[b]||'Commercial';if(!cats[cat])cats[cat]=[];cats[cat].push(b)});
let h='<input class="stc-search" placeholder="Search brands..." oninput="filterStockSidebar(this.value)">';
Object.entries(cats).forEach(([cat,list])=>{if(!list.length)return;
h+=`<div class="stc-group">${cat} \u2014 ${list.length} brands</div>`;
list.forEach(b=>{const d=S.bt[b],rv=d.rv,it=d.it,av=d.av;
const avCol=av===0?'var(--red)':av<5?'var(--amber)':'var(--muted)';
h+=`<div class="stc-item${_stockDetailBrand===b?' active':''}" onclick="sidebarBrandClick('${b}')"><div><div class="stc-name">${b}</div><div class="stc-meta">${rv} resv${it>0?' \u00b7 '+it+' transit':''}</div></div><div class="stc-count" style="color:${avCol}">${av}</div></div>`})});
sb2.innerHTML=h}

function sidebarBrandClick(b){
if(window.innerWidth<1024){stockChipClick('brand',b);return}
if(_stockDetailBrand===b){_stockDetailBrand='';_sdModelFilter=[];renderStockDefault();renderStockSidebar();return}
_stockDetailBrand=b;_sdModelFilter=[];renderStockDetail(b);renderStockSidebar()}

function _sdOpenModel(m){const mData=_sdModels[m];if(!mData)return;openVehicleDetail(m,_stockDetailBrand,mData.rows)}

function renderStockDetail(brand){
const d=S.bt[brand];if(!d)return;
const items=S.agg[brand]||[];
const models={};items.forEach(i=>{if(!models[i.model])models[i.model]={qty:0,rows:[]};models[i.model].qty+=i.qty;models[i.model].rows.push(i)});
_sdModels=models;
const modelNames=Object.keys(models).sort();
const combos=items.length;const total=d.ts;
let h='<div class="sd-detail" id="sdDetailContainer">';
h+=`<div class="sd-header"><div class="sd-brand">${brand}</div><div class="sd-subtitle">${combos} combos \u00b7 ${total} total</div></div>`;
h+='<div class="sd-kpis">';
h+=`<div class="sd-kpi"><div class="sl">On Ground</div><div class="sv">${d.ts}</div></div>`;
h+=`<div class="sd-kpi"><div class="sl">Available</div><div class="sv" style="color:var(--accent)">${d.av}</div></div>`;
h+=`<div class="sd-kpi"><div class="sl">Reserved</div><div class="sv" style="color:var(--amber)">${d.rv}</div></div>`;
h+=`<div class="sd-kpi"><div class="sl">In Transit</div><div class="sv" style="color:var(--blue)">${d.it}</div></div>`;
h+='</div>';
h+='<div class="sd-chip-label">Model</div><div class="sd-chips">';
modelNames.forEach(m=>{const sel=_sdModelFilter.includes(m);
h+=`<button type="button" class="bchip${sel?' active':''}" onclick="sdToggleModel('${m.replace(/'/g,"\\'")}')">` +
`${m}<span class="cnt">${models[m].qty}</span></button>`});
h+='</div>';
const filtered=_sdModelFilter.length?_sdModelFilter.length:modelNames.length;
if(_sdModelFilter.length>0){
h+=`<div class="sd-filter-bar">Showing ${filtered} of ${modelNames.length} <span class="sd-clear" onclick="sdClearFilter()">\u2715 Clear</span></div>`}
h+='<table class="t"><thead><tr><th>Model</th><th>Trim</th><th>Colour</th><th class="num">Qty</th></tr></thead><tbody>';
const visibleModels=_sdModelFilter.length?_sdModelFilter:modelNames;
visibleModels.forEach(m=>{const mData=models[m];if(!mData)return;
h+=`<tr class="model-hdr" style="cursor:pointer" onclick="_sdOpenModel('${m.replace(/'/g,"\\'")}')"><td colspan="4">${m}</td></tr>`;
mData.rows.sort((a,b)=>a.trim.localeCompare(b.trim)||a.colour.localeCompare(b.colour)).forEach(r=>{
h+=`<tr onclick="_sdOpenModel('${m.replace(/'/g,"\\'")}')"><td>${m}</td><td>${r.trim}</td><td>${r.colour}</td><td class="num">${r.qty===0?'<span class="zero">0</span>':r.qty}</td></tr>`});
const sub=mData.qty;
h+=`<tr class="tr"><td colspan="3">${m} subtotal</td><td class="num">${sub}</td></tr>`});
const grandTotal=visibleModels.reduce((s,m)=>s+(models[m]?models[m].qty:0),0);
h+=`<tr class="tr"><td colspan="3" style="font-size:var(--fs-body-sm);letter-spacing:.5px">TOTAL</td><td class="num" style="color:var(--accent)">${grandTotal}</td></tr>`;
h+='</tbody></table>';
h+='</div>';
document.getElementById('stockMain').innerHTML=h}

function sdToggleModel(m){
const idx=_sdModelFilter.indexOf(m);
if(idx>=0)_sdModelFilter.splice(idx,1);else _sdModelFilter.push(m);
renderStockDetail(_stockDetailBrand)}
function sdClearFilter(){_sdModelFilter=[];renderStockDetail(_stockDetailBrand)}

function openVehicleDetail(model,brand,items){
const vd=VEHICLE_DATA[model]||{};
const totalQty=items.reduce((s,r)=>s+r.qty,0);
const hasSpecs=vd.specs&&Object.keys(vd.specs).length>0;
const hasFeatures=vd.features&&vd.features.length>0;
const hasBrochure=vd.brochure&&vd.brochure.length>0;
const hasPrice=vd.price_range&&vd.price_range.length>0;
const hasAnyData=hasSpecs||hasFeatures||hasBrochure||hasPrice;
let h='<div class="sd-vdetail">';
h+=`<button class="sd-vback" onclick="_sdModelFilter=[];if(window.innerWidth<=600){renderStockDefault()}else{renderStockDetail('${brand.replace(/'/g,"\\'")}')}renderStockSidebar()">\u2190 Back to ${brand}</button>`;
h+='<div class="sd-vhero"><div class="sd-vhero-left">';
h+=`<div class="sd-vmodel">${model}</div>`;
h+=`<div class="sd-vbrand-label">${brand}</div>`;
h+='</div><div class="sd-vhero-right">';
if(hasPrice)h+=`<div class="sd-vprice">${vd.price_range}</div>`;
h+=`<div style="text-align:right"><div class="sd-vqty-big">${totalQty}</div><div class="sd-vqty-label">in stock</div></div>`;
h+='</div></div>';
h+='<div class="sd-vsection">';
h+=`<div class="sd-vsec-title">Stock Breakdown</div>`;
h+='<table class="t"><thead><tr><th>Trim</th><th>Colour</th><th class="num">Qty</th></tr></thead><tbody>';
items.sort((a,b)=>a.trim.localeCompare(b.trim)||a.colour.localeCompare(b.colour)).forEach(r=>{
h+=`<tr><td>${r.trim}</td><td>${r.colour}</td><td class="num">${r.qty===0?'<span class="zero">0</span>':r.qty}</td></tr>`});
h+='</tbody></table></div>';
if(hasSpecs||hasFeatures){
h+='<div class="sd-vsection">';
h+=`<div class="sd-vsec-title">Specs & Features</div>`;
if(hasSpecs){
const specLabels={engine:'Engine',power:'Power',transmission:'Trans',fuel:'Fuel',seats:'Seats',drive:'Drive'};
h+='<div class="sd-vspecs-inline">';
Object.entries(vd.specs).forEach(([k,v])=>{
h+=`<span class="sd-vspec-pair"><span class="sd-vspec-label">${specLabels[k]||k}:</span>${v}</span>`});
h+='</div>';}
if(hasFeatures){
h+='<div class="sd-vfeatures">';
vd.features.forEach(f=>{h+=`<div class="sd-vfeat">${f}</div>`});
h+='</div>';}
h+='</div>';}
if(hasBrochure){
h+='<div class="sd-vsection">';
h+=`<a class="sd-vbrochure-link" href="${vd.brochure}" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg> Download Brochure PDF</a>`;
h+='</div>';}
if(!hasAnyData){
h+='<div class="sd-vempty-note">Vehicle details will be added by management</div>';}
h+='</div>';
document.getElementById('stockMain').innerHTML=h}

function renderStockDefault(){
_stockDetailBrand='';_sdModelFilter=[];
const el=document.getElementById('stockMain');
el.innerHTML='<div class="brand-chips" id="brandChips"></div><div class="chip-row" id="modelChipRow"><span class="chip-label">Model</span><div class="brand-chips" id="modelChips"></div></div><div class="chip-row" id="trimChipRow"><span class="chip-label">Trim</span><div class="brand-chips" id="trimChips"></div></div><div class="chip-row" id="colourChipRow"><span class="chip-label">Colour</span><div class="brand-chips" id="colourChips"></div></div><div class="active-filters" id="activeFilters"></div><div id="stockMobileList" class="stk-list"></div><div id="stockTab"></div>';
stockTable=null;_sf={brand:'',model:'',trim:'',colour:''};
const rows=[];sb(S.agg).forEach(b=>{(S.agg[b]||[]).forEach(i=>{rows.push({brand:b,model:i.model,trim:i.trim,colour:i.colour,qty:i.qty})})});
stockTable=new Tabulator('#stockTab',{data:rows,layout:'fitColumns',height:'70vh',renderVertical:'virtual',placeholder:'No stock data loaded',columns:[{title:'Brand',field:'brand',visible:false},{title:'Model',field:'model',width:170},{title:'Trim',field:'trim'},{title:'Colour',field:'colour'},{title:'Qty',field:'qty',hozAlign:'right',headerFilter:'number',headerFilterPlaceholder:'min',headerFilterFunc:'>=',width:80,bottomCalc:'sum',formatter:function(cell){const v=cell.getValue();return v===0?'<span style="color:var(--dim)">0</span>':v}}],groupBy:'brand',groupStartOpen:false,groupHeader:function(value,count,data){const tot=data.reduce((s,r)=>s+r.qty,0);return'<span style="font-weight:700;letter-spacing:.5px">'+value+'</span><span style="color:var(--accent);font-size:12px;font-weight:600;margin-left:10px;font-family:SF Mono,monospace">'+tot+'</span><span style="color:var(--dim);font-size:10px;margin-left:4px">units</span>'},initialSort:[{column:'brand',dir:'asc'},{column:'model',dir:'asc'}]});stockTable.on('dataFiltered',updateActiveFilters);stockTable.on('tableBuilt',renderStockMobileList);renderBrandChips()}

function filterStockSidebar(q){const items=document.querySelectorAll('#stockSidebar .stc-item');
items.forEach(it=>{it.style.display=!q||it.textContent.toLowerCase().includes(q.toLowerCase())?'':'none'})}

// ——— RESERVATIONS VIEW ———

function rResv(){const el=document.getElementById('rC'),fl=document.getElementById('rF');
const ub=document.getElementById('userBadge');if(ub)ub.textContent=_user||'';
if(S.resv.reserved.length===0&&S.resv.preOrder.length===0){el.innerHTML='<div class="empty"><div class="ic"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="vertical-align:middle"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg></div><div class="mg">No reservation file loaded.<br>Drop the reservation sheet on the Upload page, or click Sync to load from server.</div></div>';fl.innerHTML='';return}
[...S.resv.reserved,...S.resv.preOrder].forEach(r=>{if(r.date){const d=dayjs(r.date instanceof Date?r.date:r.date);if(d.isValid())r.days=dayjs().diff(d,'day')}});
const brands=[...new Set([...S.resv.reserved,...S.resv.preOrder].map(r=>nb(r.brand)))].sort();
let fh='<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">';
if(currentRole==='ops')fh+='<button class="add-resv-btn" onclick="openResvModal()">+ Add Reservation</button>';
fh+='<div style="display:flex;gap:4px;flex-wrap:wrap">';
fh+='<button class="fb active" onclick="fResv(\'all\',this)">All</button>';brands.forEach(b=>{fh+=`<button class="fb" onclick="fResv('${b}',this)">${b}</button>`});fh+='</div></div>';
fh+='<div style="margin-top:4px;display:flex;align-items:center;gap:6px"><span style="font-size:10px;color:var(--dim)">Sort:</span>';
const ss=_resvSort||'days';
fh+=`<button class="fb${ss==='days'?' active':''}" style="padding:3px 8px;font-size:10px" onclick="setResvSort('days',this)">Oldest</button>`;
fh+=`<button class="fb${ss==='paid'?' active':''}" style="padding:3px 8px;font-size:10px" onclick="setResvSort('paid',this)">\u20A6 Paid</button>`;
fh+=`<button class="fb${ss==='inv'?' active':''}" style="padding:3px 8px;font-size:10px" onclick="setResvSort('inv',this)">\u20A6 Invoice</button>`;
fh+='</div>'
fl.innerHTML=fh;rRT('all')}

function fResv(b,btn){document.querySelectorAll('.rf .fb').forEach(x=>x.classList.remove('active'));if(btn)btn.classList.add('active');S.abf=b;rRT(b)}
function setRtf(v,btn){_rtf=v;document.querySelectorAll('.rtf-btn').forEach(x=>x.classList.remove('active'));if(btn)btn.classList.add('active');rRT(S.abf)}
function setResvSort(v,btn){_resvSort=v;btn.parentElement.querySelectorAll('.fb').forEach(x=>x.classList.remove('active'));btn.classList.add('active');rRT(S.abf||'all')}

function rRT(b){const el=document.getElementById('rC');
const fBrand=r=>b==='all'||nb(r.brand)===b;
const alertF=r=>{if(alertFilter==='overdue')return r.days>90;if(alertFilter==='paid')return r.amtPaid>0&&r.invAmt>0&&r.amtPaid>=r.invAmt;return true};
const fAll=r=>fBrand(r)&&alertF(r);
const sortFn=_resvSort==='paid'?(a,b)=>(b.amtPaid||0)-(a.amtPaid||0):_resvSort==='inv'?(a,b)=>(b.invAmt||0)-(a.invAmt||0):(a,b)=>(b.days||0)-(a.days||0);
let h='';
const isDesk=window.innerWidth>=1024;
const mkT=(items,title)=>{if(!items.length)return'';const tu=items.reduce((s,r)=>s+r.units,0);const tp=items.reduce((s,r)=>s+(r.amtPaid||0),0);const ti=items.reduce((s,r)=>s+(r.invAmt||0),0);
let x=`<div class="sl2">${title} <span class="pill">${items.length} entries \u00b7 ${tu} units${ti>0?' \u00b7 '+pctBar(tp,ti):''}</span></div><table class="t"><thead><tr><th>Client</th><th>Brand / Model</th><th class="num">Units</th><th>Status</th><th class="num">Paid</th><th class="num">Days</th>${isDesk?'<th>Salesperson</th>':''}<th style="width:60px"></th></tr></thead><tbody>`;
window._resvRows=[];
items.sort(sortFn).forEach((r,ri)=>{const ac=r.days>180?'a-c':r.days>90?'a-w':'a-ok';
window._resvRows[ri]=r;
const paidCell=r.invAmt>0?pctBar(r.amtPaid,r.invAmt):(r.amtPaid>0?'<span style="color:var(--accent);font-size:var(--fs-body-sm);font-family:JetBrains Mono,monospace">'+r.amtPaid.toLocaleString()+'</span>':'');
const acts=r.id?`<td style="white-space:nowrap" onclick="event.stopPropagation()"><button class="row-act" onclick="editResvRow('${r.id}')" title="Edit">&#9998;</button><button class="row-act row-del" onclick="deleteResvRow('${r.id}','${r.client.replace(/'/g,'\\&#39;')}')" title="Remove">&#10005;</button></td>`:'<td></td>';
const sc=statusChip(r.status);
x+=`<tr style="cursor:pointer${r.src==='form'||r.src==='api'?';border-left:2px solid var(--accent)':''}" onclick="openDetailModal(window._resvRows[${ri}])"><td style="font-weight:500">${r.client}</td><td>${r.brand} ${r.model}</td><td class="num" style="font-weight:700;font-family:JetBrains Mono,monospace">${r.units}</td><td>${sc}</td><td>${paidCell}</td><td class="num"><span class="aging ${ac}">${r.days}d</span></td>${isDesk?'<td style="font-size:var(--fs-body-sm);color:var(--muted)">'+(r.sp||'\u2014')+'</td>':''}${acts}</tr>`});return x+'</tbody></table>'};
h+=mkT(S.resv.reserved.filter(fAll),'Reserved');h+=mkT(S.resv.preOrder.filter(fAll),'Pre-Order');
if(!h)h='<div style="text-align:center;padding:40px;color:var(--muted)">No reservations match the current filters.</div>';
el.innerHTML=h}

// ——— DETAIL MODAL ———

function openDetailModal(record){
const m=document.getElementById('detailModal');m.classList.add('on');
document.getElementById('dm-client').textContent=record.client;
document.getElementById('dm-units').textContent=record.units;
const dc=record.days>90?'var(--red)':record.days>30?'var(--amber)':'var(--text)';
document.getElementById('dm-days').textContent=record.days+'d';
document.getElementById('dm-days').style.color=dc;
const pct=record.invAmt>0?Math.round((record.amtPaid||0)/record.invAmt*100):0;
const pc=pct>=100?'var(--green)':pct>=50?'var(--accent)':'var(--amber)';
document.getElementById('dm-paid').textContent=record.invAmt>0?pct+'%':'\u2014';
document.getElementById('dm-paid').style.color=record.invAmt>0?pc:'var(--dim)';
let pb='';
if(record.invAmt>0){const paid=(record.amtPaid||0).toLocaleString(),inv=record.invAmt.toLocaleString();
pb=`<div style="display:flex;justify-content:space-between;font-size:var(--fs-body-sm);color:var(--muted);margin-bottom:3px"><span>\u20A6${paid} paid</span><span>\u20A6${inv} total</span></div><div style="height:4px;background:var(--dim);border-radius:2px"><div style="height:100%;width:${Math.min(100,pct)}%;background:${pc};border-radius:2px"></div></div>`}
document.getElementById('dm-paybar').innerHTML=pb;
const rows=[
['Status',statusChip(record.status)],['Vehicle',record.brand+' '+record.model+(record.colour?' '+record.colour:'')],
['Colour',record.colour||'\u2014'],['Branch',record.branch||'\u2014'],['Salesperson',record.sp||'\u2014'],
['Date',record.date?dayjs(record.date).format('DD MMM YYYY'):'\u2014'],
['Invoice',record.invStatus||'\u2014'],['Source',record.src==='form'?'Manual entry':'From file']
];
document.getElementById('dm-rows').innerHTML=rows.map(([l,v])=>`<div class="m-row"><span class="m-row-l">${l}</span><span class="m-row-v">${v}</span></div>`).join('');
const eb=document.getElementById('dm-edit-btn');
if(record.id){eb.style.display='';eb.onclick=()=>{closeDetailModal();editResvRow(record.id)}}else{eb.style.display='none'}}
function closeDetailModal(){document.getElementById('detailModal').classList.remove('on')}

// ——— DOWNLOADS ———

function dlStock(){const w=XLSX.utils.book_new(),allBrands=sb(S.bt),d=new Date(),ds=p2(d.getDate())+'/'+p2(d.getMonth()+1)+'/'+String(d.getFullYear()).slice(-2);
const brands=alertFilter==='stockout'?allBrands.filter(b=>{const t=S.bt[b];return t.av===0&&t.rv>0}):alertFilter==='transit'?allBrands.filter(b=>S.bt[b].it>0):allBrands;
brands.forEach(b=>{const items=S.agg[b]||[],rows=[[`STOCK SUMMARY AS AT ${ds}`],['MODEL','TRIM/TYPE','COLOUR','QTY.']];items.forEach(i=>rows.push([i.model,i.trim,i.colour,i.qty]));rows.push(['TOTAL','','',items.reduce((s,i)=>s+i.qty,0)]);XLSX.utils.book_append_sheet(w,XLSX.utils.aoa_to_sheet(rows),b.substring(0,31))});
const sr=[['','','Reserved for customers','Reserve','Display','QC','Transport','Available to sell']];brands.forEach(b=>{const t=S.bt[b];sr.push([b,t.ts,t.rv,0,0,t.wip,0,t.av])});XLSX.utils.book_append_sheet(w,XLSX.utils.aoa_to_sheet(sr),'Sheet1');
const suffix=alertFilter?`_${alertFilter.toUpperCase()}`:'';XLSX.writeFile(w,`STOCK_SUMMARY_${d.getDate()}_${MO[d.getMonth()]}_S.A_${suffix}.xlsx`)}

function dlExec(){const w=XLSX.utils.book_new(),d=new Date(),ds=p2(d.getDate())+'/'+p2(d.getMonth()+1)+'/'+d.getFullYear(),allBrands=sb(S.bt);
const brands=alertFilter==='stockout'?allBrands.filter(b=>{const t=S.bt[b];return t.av===0&&t.rv>0}):alertFilter==='transit'?allBrands.filter(b=>S.bt[b].it>0):allBrands;
const s1=[['Summary','Motors Division - Consignment Summary','',ds],[''],[''],['BRAND','TOTAL STOCK','TOTAL RESERVED','TOTAL WIP','TOTAL AVAILABLE TO SELL']];brands.forEach(b=>{const t=S.bt[b];s1.push([b,t.ts,t.rv,t.wip,t.av])});XLSX.utils.book_append_sheet(w,XLSX.utils.aoa_to_sheet(s1),'Summary (1)');
const s2=[['Summary','Motors Division - Consignment Summary','',ds],[''],[''],['','On Ground','','','','In Transit','','','TOTAL Available to Sell'],['Brand','Stock','Reserved','WIP','Available','Stock','Reserved','Available','']];brands.forEach(b=>{const t=S.bt[b];s2.push([b,t.ts,t.rv,t.wip,t.av,t.it,0,t.it,t.av])});XLSX.utils.book_append_sheet(w,XLSX.utils.aoa_to_sheet(s2),'Summary (2)');
const suffix=alertFilter?`_${alertFilter.toUpperCase()}`:'';
XLSX.writeFile(w,`EXEC_STOCK_SUMMARY_-_${p2(d.getDate())}.${p2(d.getMonth()+1)}.${String(d.getFullYear()).slice(-2)}${suffix}_.xlsx`)}

function dlResv(){const w=XLSX.utils.book_new();
const brandF=r=>!S.abf||S.abf==='all'||nb(r.brand)===S.abf;
const aF=r=>{if(alertFilter==='overdue')return r.days>90;if(alertFilter==='paid')return r.amtPaid>0&&r.invAmt>0&&r.amtPaid>=r.invAmt;return true};
const keep=r=>brandF(r)&&aF(r);
const rR=[['CLIENT NAME','Branch','Date','Days Reserved','BRAND','MODEL','COLOUR','UNIT','STATUS','Amount Paid','Invoice Amount','Payment Completion Date','Invoice Status','SALES PERSON','REMARKS']];S.resv.reserved.filter(keep).forEach(r=>{rR.push([r.client,r.branch,fd(r.date),r.days,r.brand,r.model,r.colour,r.units,r.status,r.amtPaid||'',r.invAmt||'',fd(r.payCompDate),r.invStatus||'',r.sp,r.rem])});XLSX.utils.book_append_sheet(w,XLSX.utils.aoa_to_sheet(rR),'Reserved (updated)');
const pR=[['CLIENT NAME','Branch','Date','Days Reserved','BRAND','MODEL','COLOUR','UNIT','STATUS','Amount Paid','Invoice Amount','Payment Completion Date','SALES PERSON','REMARKS']];S.resv.preOrder.filter(keep).forEach(r=>{pR.push([r.client,r.branch,fd(r.date),r.days,r.brand,r.model,r.colour,r.units,r.status,r.amtPaid||'',r.invAmt||'',fd(r.payCompDate),r.sp,r.rem])});XLSX.utils.book_append_sheet(w,XLSX.utils.aoa_to_sheet(pR),'Pre-Order');
XLSX.writeFile(w,`RESERVATION_SHEET_-_${new Date().toLocaleDateString('en-GB').replace(/\//g,'.')}.xlsx`)}

// ——— TABLE FILTER ———

function filterTable(cid,q){const el=document.getElementById(cid);if(!el)return;el.querySelectorAll('table.t').forEach(tbl=>{const rows=[...tbl.querySelectorAll('tbody tr')];const dataRows=rows.filter(r=>!r.classList.contains('tr')&&!r.classList.contains('model-hdr'));
let fuseHits=new Set();if(q&&dataRows.length){const items=dataRows.map((r,i)=>({idx:i,text:r.textContent}));const fuse=new Fuse(items,{keys:['text'],threshold:0.4,ignoreLocation:true});fuseHits=new Set(fuse.search(q).map(r=>r.item.idx))}
const hdrMatch={};if(q){rows.forEach(r=>{if(r.classList.contains('model-hdr')&&fuzzyMatch(q,r.textContent))hdrMatch[rows.indexOf(r)]=true})}
let di=0,curHdr=-1;rows.forEach((r,ri)=>{r.classList.remove('fuse-hl');if(r.classList.contains('model-hdr')){curHdr=ri;r.style.display=q?'none':'';return}if(r.classList.contains('tr')){r.style.display=q?'none':'';return}const show=!q||fuseHits.has(di)||fuzzyMatch(q,r.textContent)||hdrMatch[curHdr];r.style.display=show?'':'none';if(show&&q)r.classList.add('fuse-hl');di++});
if(q){rows.forEach(r=>{if(r.classList.contains('model-hdr')){let sib=r.nextElementSibling,hasVis=false;while(sib&&!sib.classList.contains('model-hdr')&&!sib.classList.contains('tr')){if(sib.style.display!=='none')hasVis=true;sib=sib.nextElementSibling}r.style.display=hasVis?'':'none';if(hasVis){let sub=sib;while(sub&&sub.classList.contains('tr')&&sub.textContent.toLowerCase().includes('subtotal')){sub.style.display='';sub=sub.nextElementSibling}}}});
rows.forEach(r=>{if(r.classList.contains('tr')){const txt=r.textContent.toLowerCase();if(txt.includes('subtotal')){let prev=r.previousElementSibling,hasVis=false;while(prev&&!prev.classList.contains('model-hdr')&&!prev.classList.contains('tr')){if(prev.style.display!=='none')hasVis=true;prev=prev.previousElementSibling}r.style.display=hasVis?'':'none'}else if(txt.includes('total')){let anyData=false;rows.forEach(dr=>{if(!dr.classList.contains('tr')&&!dr.classList.contains('model-hdr')&&dr.style.display!=='none')anyData=true});r.style.display=anyData?'':'none'}}})}});
el.querySelectorAll('.sl2').forEach(s=>{const next=s.nextElementSibling;if(next&&next.tagName==='TABLE'){let any=false;next.querySelectorAll('tbody tr:not(.tr):not(.model-hdr)').forEach(r=>{if(r.style.display!=='none')any=true});s.style.display=any||!q?'':'none'}})}

// ——— KPI TOOLTIPS ———

function kpiTip(key){
const sf=k=>{const f=S.files[k];if(!f||!f.name){const sd=S._snapDate?dayjs(S._snapDate).format('D MMM YYYY'):'unknown';return'\n\nData from snapshot ('+sd+') \u2014 upload report to see exact filename'}const d=f.date?(' \u2014 dated '+dayjs(f.date).format('D MMM YYYY')):'';return'\n\nFile: '+f.name+d};
const tips={
stock:'All vehicles across every Mikano warehouse and showroom right now. Source: Serial No Details ERP report.'+sf('ser'),
available:'Vehicles not earmarked for any customer yet. Calculation: Total Stock minus Reserved = Available.'+sf('ser')+sf('resv'),
reserved:'Vehicles with a deposit or earmarked for a customer. Source: Reservation Sheet.'+sf('resv'),
transit:'Vehicles currently being shipped between locations. Parts and spares excluded \u2014 vehicles only. Source: Goods in Transit report.'+sf('git'),
delivered:'Total units delivered to customers year-to-date. Includes vehicles, parts, and accessories \u2014 that\'s why it\'s higher than just vehicle deliveries. Source: YTD Delivery Register.'+sf('desp'),
payment:'Percentage of money collected vs invoiced, across reservations that have an invoice amount.'+sf('resv'),
overdue:'Reservations older than 48 hours where full payment hasn\'t come in yet.'+sf('resv'),
wip:'Vehicles in quality control or being prepped. Currently requires manual input.'
};return tips[key]||''}

function showKpiTip(e,key){e.stopPropagation();dismissTip();
const r=e.target.getBoundingClientRect();const tip=document.createElement('div');tip.className='kpi-tip';
tip.style.whiteSpace='pre-wrap';tip.textContent=kpiTip(key);document.body.appendChild(tip);
let top=r.bottom+8,left=r.left;
if(left+280>window.innerWidth)left=window.innerWidth-290;
if(top+100>window.innerHeight)top=r.top-tip.offsetHeight-8;
tip.style.top=top+'px';tip.style.left=Math.max(8,left)+'px';_tipEl=tip;
setTimeout(()=>document.addEventListener('click',dismissTip,{once:true}),10)}
function dismissTip(){if(_tipEl){_tipEl.remove();_tipEl=null}}

function showDataAge(dateStr){
const snapDate=dayjs(dateStr,'YYYY-MM-DD');const now=dayjs();
const days=now.diff(snapDate,'day');
let txt,bg,fg;
if(days===0){txt='Data from today';bg='var(--green)';fg='#000'}
else if(days===1){txt='Data from yesterday';bg='var(--amber)';fg='#000'}
else{txt='Data is '+days+' days old';bg='var(--red)';fg='#fff'}
['dataAge','dataAgeOps'].forEach(id=>{const el=document.getElementById(id);if(!el)return;
el.textContent=txt;el.style.background=bg;el.style.color=fg;el.style.display='inline-block'})}

// ——— ROLE TOGGLE ———

function setRole(r){
currentRole=r;localStorage.setItem('mikano-stock-role',r);
document.querySelectorAll('.role-btn').forEach(b=>{b.classList.toggle('active',b.dataset.role===r)});
renderBottomNav();
if(Object.keys(S.bt).length>0){renderOverview();rResv()}}

// ——— BOTTOM NAV ———

function renderBottomNav(activeView){
const bn=document.getElementById('bottomNav');if(!bn)return;
const av=activeView||'overview';
const items=[
{v:'overview',label:'Overview',svg:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>'},
{v:'stock',label:'Stock',svg:'<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>'},
{v:'reservations',label:'Reservations',svg:'<svg viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>'},
{v:'upload',label:'Upload',svg:'<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'}
];
const visible=currentRole==='mgmt'?items.filter(i=>i.v!=='upload'):items;
bn.innerHTML=visible.map(i=>`<div class="bnav-item${av===i.v?' active':''}" onclick="nav('${i.v}')">${i.svg}<span class="bnav-label">${i.label}</span></div>`).join('')}

// ——— SALES SUMMARY ———

function renderSalesSummary(){
if(!S.sales||!S.sales.length)return'<div style="padding:12px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);color:var(--dim);font-size:12px;text-align:center;margin-bottom:16px">Upload Sales Summary file to see sales data</div>';
const totalQty=S.sales.reduce((s,r)=>s+r.qty,0);
const modelQty={};S.sales.forEach(r=>{modelQty[r.model]=(modelQty[r.model]||0)+r.qty});
const topModel=Object.entries(modelQty).sort((a,b)=>b[1]-a[1])[0];
const typeQty={};S.sales.forEach(r=>{const t=String(r.btype||'Other').toUpperCase();if(t.includes('FLEET'))typeQty.fleet=(typeQty.fleet||0)+r.qty;else typeQty.retail=(typeQty.retail||0)+r.qty});
const fleetPct=totalQty>0?Math.round((typeQty.fleet||0)/totalQty*100):0;
const retailPct=100-fleetPct;
let h='<div class="mgmt-kpis" style="grid-template-columns:repeat(3,1fr);margin-bottom:12px">';
h+=`<div class="mgmt-kpi"><div class="kpi-val" style="font-size:24px">${totalQty}</div><div class="kpi-lbl">Units Sold</div></div>`;
h+=`<div class="mgmt-kpi"><div class="kpi-val" style="font-size:14px">${topModel?topModel[0]:'\u2014'}</div><div class="kpi-lbl">Top Model</div></div>`;
h+=`<div class="mgmt-kpi"><div class="kpi-val" style="font-size:16px">${fleetPct}/${retailPct}</div><div class="kpi-lbl">Fleet / Retail</div></div>`;
h+='</div>';
const sorted=Object.entries(modelQty).sort((a,b)=>b[1]-a[1]).slice(0,10);
const modelRep={};S.sales.forEach(r=>{const k=r.model;if(!modelRep[k])modelRep[k]={};modelRep[k][r.rep]=(modelRep[k][r.rep]||0)+r.qty});
h+='<table class="t"><thead><tr><th>Brand</th><th>Model</th><th class="num">Sold</th><th>Top Rep</th><th>Type</th></tr></thead><tbody>';
sorted.forEach(([model,qty])=>{
const brandMatch=S.sales.find(r=>r.model===model);
const brand=brandMatch?brandMatch.brand:'\u2014';
const reps=modelRep[model]||{};const topRep=Object.entries(reps).sort((a,b)=>b[1]-a[1])[0];
const typeMatch=S.sales.filter(r=>r.model===model);
const fleetCount=typeMatch.filter(r=>String(r.btype||'').toUpperCase().includes('FLEET')).reduce((s,r)=>s+r.qty,0);
const typeLabel=fleetCount>qty/2?'Fleet':'Retail';
h+=`<tr><td>${brand}</td><td>${model}</td><td class="num" style="font-weight:700;color:var(--accent)">${qty}</td><td>${topRep?topRep[0]:'\u2014'}</td><td>${typeLabel}</td></tr>`});
h+='</tbody></table>';
return h}

// ——— OVERVIEW (replaces both Dashboard + Management) ———

function renderOverview(){
const el=document.getElementById('overviewContent');if(!el)return;
const hasStock=Object.keys(S.bt).length>0;
const hasResv=S.resv?.reserved?.length>0||S.resv?.preOrder?.length>0;
const hasGit=S.git?.length>0;
if(!hasStock&&!hasResv&&!hasGit){
el.innerHTML='<div class="mgmt-empty"><div class="ic"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--dim)" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 17V13M12 17V9M17 17V5"/></svg></div><div class="mg">Upload your reports to see the overview.<br><span class="switch-link" onclick="nav(\'upload\')">Go to Upload</span></div></div>';
return}
let tStock=0,tResv=0,tAvail=0,tTransit=0;
Object.values(S.bt).forEach(d=>{tStock+=d.ts;tResv+=d.rv;tAvail+=d.av;tTransit+=d.it});
const brands=sb(S.bt);
const allResv=[...S.resv.reserved,...S.resv.preOrder];
const now=dayjs();
let h='<div class="mgmt-kpis">';
h+=`<div class="mgmt-kpi"><div class="kpi-val">${tStock.toLocaleString()}</div><div class="kpi-lbl">Total Stock <span class="kpi-i" onclick="showKpiTip(event,'stock')">ⓘ</span></div></div>`;
const availCol=tStock>0?(tAvail/tStock>.6?'var(--green)':tAvail/tStock>.3?'var(--amber)':'var(--red)'):'var(--text)';
h+=`<div class="mgmt-kpi"><div class="kpi-val" style="color:${availCol}">${tAvail.toLocaleString()}</div><div class="kpi-lbl">Available <span class="kpi-i" onclick="showKpiTip(event,'available')">ⓘ</span></div></div>`;
h+=`<div class="mgmt-kpi"><div class="kpi-val" style="color:var(--amber)">${tResv.toLocaleString()}</div><div class="kpi-lbl">Reserved <span class="kpi-i" onclick="showKpiTip(event,'reserved')">ⓘ</span></div></div>`;
h+=`<div class="mgmt-kpi"><div class="kpi-val" style="color:var(--blue)">${tTransit.toLocaleString()}</div><div class="kpi-lbl">In Transit <span class="kpi-i" onclick="showKpiTip(event,'transit')">ⓘ</span></div></div>`;
h+='</div>';

if(currentRole==='mgmt'){
h+='<div class="mgmt-panel" style="margin-bottom:16px"><h3>Stock by Brand</h3>';
if(brands.length){
const maxBrand=Math.max(...brands.map(b=>S.bt[b].ts),1);
brands.forEach(b=>{const d=S.bt[b];if(d.ts===0&&d.it===0)return;
const total=d.ts;const avW=total>0?Math.round(d.av/maxBrand*100):0;
const rvW=total>0?Math.round(d.rv/maxBrand*100):0;
const itW=d.it>0?Math.round(d.it/maxBrand*100):0;
h+=`<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">`;
h+=`<span style="font-size:11px;color:var(--muted);width:72px;text-align:right;flex-shrink:0">${b}</span>`;
h+=`<div style="flex:1;height:22px;background:var(--bg);border-radius:3px;overflow:hidden;display:flex">`;
if(d.av>0)h+=`<div style="height:100%;width:${avW}%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:9px;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,.9);font-weight:600">${d.av}</div>`;
if(d.rv>0)h+=`<div style="height:100%;width:${rvW}%;background:var(--amber);display:flex;align-items:center;justify-content:center;font-size:9px;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,.9);font-weight:600">${d.rv>3?d.rv:''}</div>`;
if(d.it>0)h+=`<div style="height:100%;width:${itW}%;background:var(--blue);display:flex;align-items:center;justify-content:center;font-size:9px;font-family:'JetBrains Mono',monospace;color:rgba(255,255,255,.9);font-weight:600">${d.it>3?d.it:''}</div>`;
h+=`</div>`;
h+=`<span style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--dim);width:32px;text-align:right">${total}</span>`;
h+=`</div>`});
h+='<div style="display:flex;gap:12px;justify-content:center;margin-top:8px">';
h+='<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--muted)"><div style="width:8px;height:8px;border-radius:2px;background:var(--accent)"></div>Available</div>';
h+='<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--muted)"><div style="width:8px;height:8px;border-radius:2px;background:var(--amber)"></div>Reserved</div>';
h+='<div style="display:flex;align-items:center;gap:4px;font-size:10px;color:var(--muted)"><div style="width:8px;height:8px;border-radius:2px;background:var(--blue)"></div>Transit</div>';
h+='</div>'}
h+='</div>';
h+='<div class="mgmt-panel" style="margin-bottom:16px"><h3>Sales</h3>'+renderSalesSummary()+'</div>';
if(hasResv){
allResv.forEach(r=>{if(r.date){const d=dayjs(r.date instanceof Date?r.date:r.date);if(d.isValid()){r.days=Math.max(0,now.diff(d,'day'))}}});
const aged=allResv.filter(r=>r.days>90).sort((a,b)=>b.days-a.days).slice(0,10);
if(aged.length){
h+=`<div class="sd-collapse" style="margin-bottom:16px"><div class="sd-collapse-hdr" onclick="this.parentElement.classList.toggle('open')"><span class="sd-c-arrow" style="font-size:10px;color:var(--dim)">\u25B6</span><span class="sd-c-title">Aging Reservations</span><span class="sd-c-count" style="color:var(--amber)">${aged.length}</span></div>`;
h+='<div class="sd-collapse-body" style="padding:12px">';
aged.forEach(r=>{const cls=r.days>180?'a-c':r.days>90?'a-w':'a-ok';
h+=`<div class="aging-row"><span class="ar-client">${r.client}</span><span class="ar-model">${r.model} \u00b7 ${r.units}u</span><span class="aging ${cls}">${r.days}d</span></div>`});
h+='</div></div>'}}
}else{
h+='<div style="margin-bottom:16px">';
if(brands.length){
h+='<div class="bg">';
brands.forEach(b=>{const d=S.bt[b];if(d.ts===0)return;
const p=d.ts>0?Math.round(d.av/d.ts*100):0;
const c=p>60?'var(--green)':p>30?'var(--amber)':'var(--red)';
h+=`<div class="bc" onclick="brandCardNav('${b}')"><div class="bn">${b}</div><div class="ba" style="color:${c}">${d.av.toLocaleString()}</div><div class="bs">of <b>${d.ts.toLocaleString()}</b> \u00b7 <b>${d.rv}</b> resv</div><div class="bb"><div class="bbf" style="width:${p}%;background:${c}"></div></div></div>`});
h+='</div>'}
h+='</div>';
h+=`<div class="sd-collapse" style="margin-bottom:16px"><div class="sd-collapse-hdr" onclick="this.parentElement.classList.toggle('open')"><span class="sd-c-arrow" style="font-size:10px;color:var(--dim)">\u25B6</span><span class="sd-c-title">Sales</span><span class="sd-c-count" style="color:var(--accent)">NEW</span></div>`;
h+='<div class="sd-collapse-body" style="padding:12px">'+renderSalesSummary()+'</div></div>';
}
h+='<div style="display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;border-radius:8px;background:rgba(76,175,80,.06);border:1px solid rgba(76,175,80,.1);cursor:pointer;min-height:44px;margin-bottom:16px" onclick="dlExec()">';
h+='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
h+='<span style="font-size:12px;color:var(--accent);font-weight:600">Download Exec .xlsx</span></div>';
el.innerHTML=h}
