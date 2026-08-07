(()=>{
'use strict';
const $=id=>document.getElementById(id);
const KEY={notes:'alduin_notes_v3',profile:'alduin_profile_v3',lore:'alduin_lore_v3',avatar:'alduin_avatar_v3',settings:'alduin_settings_v3'};
let notes=[],photos=[],db=null,viewIndex=0,calDate=new Date();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const load=(k,d)=>{try{const x=localStorage.getItem(k);return x?JSON.parse(x):d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){console.warn(e)}};
function toast(t){const e=$('toast');if(!e)return;e.textContent=t;e.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>e.classList.remove('show'),1800)}
function showPage(id){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===id));if(id==='ai')checkLocalAI();window.scrollTo({top:0,behavior:'smooth'})}
function nav(){document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>showPage(b.dataset.page));document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>showPage(b.dataset.go));const m=document.querySelector('.mobile');if(m){const items=[['home','⌂','Главная'],['diary','📖','Дневник'],['gallery','🖼','Галерея'],['ai','🧠','AI'],['profile','👑','Профиль'],['settings','⚙','Настройки']];m.innerHTML=items.map(([id,icon,label])=>`<button class="mobile-btn" data-page="${id}" type="button"><b>${icon}</b><span>${label}</span></button>`).join('');m.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>showPage(b.dataset.page))}}
function openDB(){return new Promise((resolve,reject)=>{if(!window.indexedDB)return reject(new Error('no indexedDB'));let r=indexedDB.open('ALDUIN_X_V3',1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('photos'))r.result.createObjectStore('photos',{keyPath:'id',autoIncrement:true})};r.onsuccess=()=>{db=r.result;resolve()};r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('blocked'))})}
function dbAll(){return new Promise((res,rej)=>{if(!db)return rej();let r=db.transaction('photos').objectStore('photos').getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function dbAdd(p){return new Promise((res,rej)=>{if(!db)return rej();let r=db.transaction('photos','readwrite').objectStore('photos').add(p);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function dbDel(id){return new Promise((res,rej)=>{if(!db)return rej();let r=db.transaction('photos','readwrite').objectStore('photos').delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function renderNotes(){const q=($('nq')?.value||'').toLowerCase();const a=notes.filter(n=>(n.title+' '+n.text+' '+n.tags).toLowerCase().includes(q)).sort((a,b)=>b.date-a.date);$('notes').innerHTML=a.length?a.map(n=>`<article class="glass panel" style="margin:9px 0"><div class="panelhead"><div><h2>${esc(n.mood)} ${esc(n.title||'Без названия')}</h2><small>${new Date(n.date).toLocaleString('ru-RU')}</small></div><button data-del-note="${n.id}">×</button></div><p>${esc(n.text).replace(/\n/g,'<br>')}</p><small>${esc(n.tags)}</small></article>`).join(''):'<div class="empty">Записей пока нет.</div>';document.querySelectorAll('[data-del-note]').forEach(b=>b.onclick=()=>{notes=notes.filter(n=>n.id!==b.dataset.delNote);save(KEY.notes,notes);renderAll()})}
function renderGallery(){const q=($('gq')?.value||'').toLowerCase();let a=photos.filter(p=>(p.name||'').toLowerCase().includes(q));const sort=$('sort')?.value||'new';a.sort((x,y)=>sort==='old'?x.date-y.date:sort==='name'?(x.name||'').localeCompare(y.name||''):y.date-x.date);$('galleryGrid').innerHTML=a.map(p=>`<div class="gitem"><img src="${p.data}" data-open="${p.id}"><button data-del-photo="${p.id}">×</button></div>`).join('');$('gEmpty').hidden=photos.length>0;document.querySelectorAll('[data-open]').forEach(i=>i.onclick=()=>openViewer(i.dataset.open));document.querySelectorAll('[data-del-photo]').forEach(b=>b.onclick=async()=>{try{if(db)await dbDel(Number(b.dataset.delPhoto))}catch{}photos=photos.filter(p=>String(p.id)!==String(b.dataset.delPhoto));renderAll()})}
function openViewer(id){viewIndex=photos.findIndex(p=>String(p.id)===String(id));if(viewIndex<0)return;$('viewImg').src=photos[viewIndex].data;$('viewer').hidden=false}
function step(d){if(!photos.length)return;viewIndex=(viewIndex+d+photos.length)%photos.length;$('viewImg').src=photos[viewIndex].data}
function renderHome(){const days=Math.max(0,Math.floor((Date.now()-Date.parse('2026-08-02T00:00:00Z'))/86400000));$('days').textContent=days;$('notesN').textContent=notes.length;$('photosN').textContent=photos.length;const n=[...notes].sort((a,b)=>b.date-a.date)[0];$('lastNote').innerHTML=n?`<h2>${esc(n.title||'Без названия')}</h2><p>${esc(n.text).slice(0,300)}</p>`:'Пока пусто.';$('miniGallery').innerHTML=photos.slice().sort((a,b)=>b.date-a.date).slice(0,4).map(p=>`<img src="${p.data}" data-open="${p.id}">`).join('');document.querySelectorAll('#miniGallery [data-open]').forEach(i=>i.onclick=()=>openViewer(i.dataset.open))}
function renderTimeline(){$('timelineList').innerHTML=notes.slice().sort((a,b)=>b.date-a.date).map(n=>`<article class="timeline-item glass"><small>${new Date(n.date).toLocaleString('ru-RU')}</small><h2>${esc(n.mood)} ${esc(n.title||'Без названия')}</h2><p>${esc(n.text).slice(0,450)}</p></article>`).join('')||'<div class="empty glass">Хронология пуста.</div>'}
function renderCalendar(){const y=calDate.getFullYear(),m=calDate.getMonth();$('month').textContent=new Date(y,m,1).toLocaleDateString('ru-RU',{month:'long',year:'numeric'});let first=(new Date(y,m,1).getDay()+6)%7,days=new Date(y,m+1,0).getDate(),html='';for(let i=0;i<first;i++)html+='<div></div>';for(let d=1;d<=days;d++){const has=notes.some(n=>{const x=new Date(n.date);return x.getFullYear()===y&&x.getMonth()===m&&x.getDate()===d});html+=`<button class="day ${has?'has':''}" data-day="${d}"><b>${d}</b>${has?'<br>✦':''}</button>`}$('cal').innerHTML=html;document.querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{const d=+b.dataset.day,a=notes.filter(n=>{const x=new Date(n.date);return x.getFullYear()===y&&x.getMonth()===m&&x.getDate()===d});$('dayInfo').innerHTML=a.length?a.map(n=>`<h3>${esc(n.title||'Без названия')}</h3><p>${esc(n.text)}</p>`).join(''):'<p>В этот день записей нет.</p>'})}
function loadProfile(){const p=load(KEY.profile,{});$('pn').value=p.name||'Alduin';$('pt').value=p.type||'Тульпа';$('po').value=p.origin||'Original Character';$('ptags').value=p.tags||'';$('pd').value=p.desc||'';const a=localStorage.getItem(KEY.avatar);if(a)$('avatar').src=a;const l=load(KEY.lore,{});$('loreChar').value=l.char||'';$('loreLook').value=l.look||'';$('loreCanon').value=l.canon||''}
function renderAll(){renderHome();renderNotes();renderGallery();renderTimeline();renderCalendar()}
function startFPS(){let last=performance.now(),frames=0;function loop(t){frames++;if(t-last>=500){const v=Math.round(frames*1000/(t-last));$('fps').textContent=v;if($('fps2'))$('fps2').textContent=v;frames=0;last=t}requestAnimationFrame(loop)}requestAnimationFrame(loop)}
function startParticles(){const host=$('particles');if(!host)return;const c=document.createElement('canvas'),ctx=c.getContext('2d',{alpha:true});host.appendChild(c);let ps=[];function resize(){c.width=innerWidth;c.height=innerHeight;ps=Array.from({length:Math.min(70,Math.max(20,Math.floor(innerWidth/18)))},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:.4+Math.random()*1.4,v:.15+Math.random()*.25,a:.12+Math.random()*.35}))}resize();addEventListener('resize',resize,{passive:true});function draw(){ctx.clearRect(0,0,c.width,c.height);for(const p of ps){p.y-=p.v;if(p.y<0)p.y=c.height;ctx.globalAlpha=p.a;ctx.fillStyle='#c98bff';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)}requestAnimationFrame(draw)}
function settings(){const s=load(KEY.settings,{fx:true,glow:true,motion:true});$('fx').checked=s.fx;$('glow').checked=s.glow;$('motion').checked=s.motion;function apply(){const v={fx:$('fx').checked,glow:$('glow').checked,motion:$('motion').checked};document.body.classList.toggle('no-particles',!v.fx);document.body.classList.toggle('no-glow',!v.glow);document.body.classList.toggle('no-motion',!v.motion);save(KEY.settings,v)}['fx','glow','motion'].forEach(id=>$(id).onchange=apply);apply()}
async function addImages(files){for(const f of files){const data=await new Promise(ok=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=()=>ok(null);r.readAsDataURL(f)});if(!data)continue;const p={name:f.name,data,date:Date.now()};try{if(db){const id=await dbAdd(p);p.id=id}else p.id='local-'+Date.now()+'-'+Math.random()}catch{p.id='local-'+Date.now()+'-'+Math.random()}photos.push(p)}renderAll();toast('Изображения добавлены')}
function wire(){nav();$('saveNote').onclick=()=>{const text=$('ntext').value.trim();if(!text)return toast('Сначала напиши текст');notes.push({id:(crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random())),date:Date.now(),title:$('nt').value,mood:$('nm').value,tags:$('ntag').value,text});save(KEY.notes,notes);$('nt').value='';$('ntext').value='';$('ntag').value='';renderAll();toast('Воспоминание сохранено')};$('nq').oninput=renderNotes;$('gq').oninput=renderGallery;$('sort').onchange=renderGallery;$('files').onchange=e=>{if(e.target.files?.length)addImages([...e.target.files]);e.target.value=''};$('saveProfile').onclick=()=>{save(KEY.profile,{name:$('pn').value,type:$('pt').value,origin:$('po').value,tags:$('ptags').value,desc:$('pd').value});toast('Профиль сохранён')};$('saveLore').onclick=()=>{save(KEY.lore,{char:$('loreChar').value,look:$('loreLook').value,canon:$('loreCanon').value});toast('Лор сохранён')};$('avatarFile').onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{localStorage.setItem(KEY.avatar,r.result);$('avatar').src=r.result};r.readAsDataURL(f)};$('prevM').onclick=()=>{calDate.setMonth(calDate.getMonth()-1);renderCalendar()};$('nextM').onclick=()=>{calDate.setMonth(calDate.getMonth()+1);renderCalendar()};$('close').onclick=()=>$('viewer').hidden=true;$('prev').onclick=()=>step(-1);$('next').onclick=()=>step(1);document.addEventListener('keydown',e=>{if($('viewer').hidden)return;if(e.key==='Escape')$('viewer').hidden=true;if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});$('export').onclick=()=>{const data={version:3,notes,profile:load(KEY.profile,{}),lore:load(KEY.lore,{}),avatar:localStorage.getItem(KEY.avatar)||'',photos};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'}));a.download='ALDUIN_X_BACKUP.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};$('import').onclick=()=>{const i=document.createElement('input');i.type='file';i.accept='.json';i.onchange=async()=>{try{const d=JSON.parse(await i.files[0].text());notes=d.notes||[];save(KEY.notes,notes);if(d.profile)save(KEY.profile,d.profile);if(d.lore)save(KEY.lore,d.lore);if(d.avatar)localStorage.setItem(KEY.avatar,d.avatar);if(db&&d.photos)for(const p of d.photos)await dbAdd({name:p.name,data:p.data,date:p.date});location.reload()}catch{toast('Ошибка импорта')}};i.click()};$('wipe').onclick=async()=>{if(!confirm('Удалить все данные ALDUIN?'))return;Object.values(KEY).forEach(k=>localStorage.removeItem(k));try{if(db){const r=db.transaction('photos','readwrite').objectStore('photos').clear();await new Promise(ok=>{r.onsuccess=ok})}}catch{}location.reload()};settings();setupALDUINAI();setInterval(()=>{$('clock').textContent=new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})},1000);$('clock').textContent=new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}
function bootSequence(){
  const bar=$("bootBar"), pct=$("bootPercent"), status=$("bootStatus");
  const steps=[
    ["AWAKENING ALDUIN CORE",18],
    ["LOADING MEMORY ARCHIVE",36],
    ["SYNCING VISUAL ENGINE",54],
    ["INITIALIZING PARTICLE FIELD",72],
    ["CALIBRATING DISPLAY PIPELINE",88],
    ["CORE ONLINE",100]
  ];
  let i=0;
  function step(){
    if(i>=steps.length)return;
    const [label,n]=steps[i++];
    if(status)status.textContent=label;
    if(bar)bar.style.width=n+"%";
    if(pct)pct.textContent=n+"%";
    setTimeout(step,i<steps.length?90:120);
  }
  step();
}
/* ===== ALDUIN AI / API MODE ===== */
const AI_CFG_KEY='alduin_ai_api_v2';
const AI_PROVIDERS={
  deepseek:{name:'DeepSeek',base:'https://api.deepseek.com',models:['deepseek-v4-flash','deepseek-v4-pro'],kind:'openai'},
  gemini:{name:'Google Gemini',base:'https://generativelanguage.googleapis.com/v1beta',models:['gemini-3.6-flash','gemini-3.5-flash','gemini-3.5-flash-lite','gemini-3.1-flash-lite'],kind:'gemini'},
  xai:{name:'Grok / xAI',base:'https://api.x.ai/v1',models:['grok-4.5','grok-4.3','grok-4.20-0309-non-reasoning'],kind:'openai'},
  openai:{name:'OpenAI',base:'https://api.openai.com/v1',models:['gpt-5.2','gpt-5.1','gpt-5.1-mini'],kind:'openai'},
  custom:{name:'Custom OpenAI-compatible',base:'',models:['custom-model'],kind:'openai'}
};
let aiConfig=load(AI_CFG_KEY,{provider:'gemini',model:'gemini-3.6-flash',key:'',base:'',history:[]});
let aiConnected=false,aiBusy=false;
function aiEl(id){return document.getElementById(id)}
function aiAdd(role,text){const chat=aiEl('aiChat');if(!chat)return;const box=document.createElement('div');box.className='ai-msg '+role;box.innerHTML='<b>'+ (role==='user'?'YOU':'ALDUIN AI') +'</b><p></p>';box.querySelector('p').textContent=text;chat.appendChild(box);chat.scrollTop=chat.scrollHeight;return box.querySelector('p')}
function aiStatus(text,on=false){const s=aiEl('aiStatus');if(!s)return;const sp=s.querySelector('span');if(sp)sp.textContent=text;s.classList.toggle('online',on)}
function saveAI(){save(AI_CFG_KEY,{provider:aiConfig.provider,model:aiConfig.model,key:aiConfig.key,base:aiConfig.base,history:aiConfig.history})}
function apiModelsFor(p){return AI_PROVIDERS[p]?.models||[]}
function fillModels(list){const p=aiEl('aiProvider')?.value||'gemini',sel=aiEl('aiModel');if(!sel)return;const arr=(list&&list.length?list:apiModelsFor(p));sel.innerHTML=arr.map(m=>`<option value="${esc(m)}">${esc(m)}</option>`).join('');if(arr.includes(aiConfig.model))sel.value=aiConfig.model;else{sel.value=arr[0]||'';aiConfig.model=sel.value}}
function renderAIHistory(){const chat=aiEl('aiChat');if(!chat)return;chat.innerHTML='';if(!aiConfig.history.length)aiAdd('ai','Привет. Выбери провайдера, вставь API key и нажми «Подключить API».');else aiConfig.history.filter(x=>x.role==='user'||x.role==='assistant').forEach(x=>aiAdd(x.role==='user'?'user':'ai',x.content))}
function providerChanged(){const p=aiEl('aiProvider').value;aiConfig.provider=p;aiEl('customBaseWrap').hidden=p!=='custom';if(p!=='custom')aiConfig.base=AI_PROVIDERS[p].base;fillModels();aiConnected=false;aiStatus('OFFLINE');saveAI()}
async function fetchProviderModels(){const p=aiConfig.provider,key=aiConfig.key;if(!key||p==='custom')return null;try{let r;if(p==='gemini'){r=await fetch(AI_PROVIDERS[p].base+'/models?key='+encodeURIComponent(key));}else{r=await fetch(AI_PROVIDERS[p].base+'/models',{headers:{Authorization:'Bearer '+key}})}if(!r.ok)return null;const d=await r.json();let ids=p==='gemini'?(d.models||[]).filter(x=>(x.supportedGenerationMethods||[]).includes('generateContent')).map(x=>String(x.name||'').replace(/^models\//,'')):((d.data||[]).map(x=>x.id).filter(Boolean));if(ids.length){fillModels(ids);saveAI()}return ids}catch(e){console.warn('Model list unavailable',e);return null}}
async function readResponse(r){let d=null;let raw='';try{raw=await r.text();d=raw?JSON.parse(raw):null}catch{}if(!r.ok){const msg=d?.error?.message||d?.message||raw||('HTTP '+r.status);throw new Error('HTTP '+r.status+': '+msg)}return d}
function friendlyAIError(e){const m=String(e?.message||e);if(/Failed to fetch|NetworkError|Load failed|CORS/i.test(m))return 'Браузер не получил ответ от API. Это может быть CORS/сетевой блок. Для этого провайдера нужен серверный proxy, либо используй провайдера, разрешающего browser requests.';return m}
async function requestAI(messages){
  const p=aiConfig.provider;
  if(p==='gemini'){
    const url=AI_PROVIDERS.gemini.base+'/models/'+encodeURIComponent(aiConfig.model)+':generateContent?key='+encodeURIComponent(aiConfig.key);
    const body={contents:messages.filter(x=>x.role!=='system').map(x=>({role:x.role==='assistant'?'model':'user',parts:[{text:x.content}]}))};
    const sys=messages.find(x=>x.role==='system');if(sys)body.systemInstruction={parts:[{text:sys.content}]};
    const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await readResponse(r);return d?.candidates?.[0]?.content?.parts?.map(x=>x.text||'').join('')||'';
  }
  const base=(aiConfig.base||AI_PROVIDERS[p]?.base||'').replace(/\/$/,'');
  if(!base)throw new Error('Base URL не указан');
  const r=await fetch(base+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+aiConfig.key},body:JSON.stringify({model:aiConfig.model,messages,temperature:.7,max_tokens:1024,stream:false})});
  const d=await readResponse(r);return d?.choices?.[0]?.message?.content||'';
}
async function connectAI(){if(aiBusy)return;aiBusy=true;aiConfig.provider=aiEl('aiProvider').value;aiConfig.model=aiEl('aiModel').value;aiConfig.key=aiEl('aiKey').value.trim();aiConfig.base=aiConfig.provider==='custom'?aiEl('aiBase').value.trim():AI_PROVIDERS[aiConfig.provider].base;if(!aiConfig.key){aiStatus('API KEY НУЖЕН');aiAdd('ai','Вставь API key.');aiBusy=false;return}if(!aiConfig.base){aiStatus('BASE URL НУЖЕН');aiBusy=false;return}saveAI();aiStatus('ПРОВЕРКА…');try{const models=await fetchProviderModels();if(models?.length&&!models.includes(aiConfig.model)){aiConfig.model=models[0];aiEl('aiModel').value=aiConfig.model;saveAI()}const reply=await requestAI([{role:'system',content:'Ты ALDUIN AI. Ответь только: OK'},{role:'user',content:'Проверка подключения.'}]);if(!reply)throw new Error('API вернул пустой ответ');aiConnected=true;aiStatus('API ONLINE',true);aiEl('aiCapability').textContent=`Подключено: ${AI_PROVIDERS[aiConfig.provider]?.name||'Custom'} / ${aiConfig.model}`;aiAdd('ai','✓ API подключён. ALDUIN AI готов.')}catch(e){aiConnected=false;aiStatus('ОШИБКА API');aiAdd('ai','Не удалось подключить API: '+friendlyAIError(e));}finally{aiBusy=false}}
async function sendALDUINAI(text){if(aiBusy)return;if(!aiConnected){aiAdd('ai','Сначала подключи API.');return}aiBusy=true;aiAdd('user',text);const p=aiAdd('ai','…');const system={role:'system',content:'Ты ALDUIN AI внутри личного сайта пользователя. Отвечай дружелюбно, спокойно и полезно. Уважай приватность пользователя.'};const messages=[system,...aiConfig.history,{role:'user',content:text}];try{const full=await requestAI(messages);if(!full)throw new Error('API вернул пустой ответ');if(p)p.textContent=full;aiConfig.history.push({role:'user',content:text},{role:'assistant',content:full});if(aiConfig.history.length>40)aiConfig.history=aiConfig.history.slice(-40);saveAI()}catch(e){if(p)p.textContent='Ошибка: '+friendlyAIError(e)}finally{aiBusy=false}}
function setupALDUINAI(){const provider=aiEl('aiProvider'),model=aiEl('aiModel'),key=aiEl('aiKey'),base=aiEl('aiBase'),connect=aiEl('aiConnect'),clear=aiEl('aiClear'),form=aiEl('aiForm'),input=aiEl('aiInput');if(!provider)return;provider.value=aiConfig.provider;key.value=aiConfig.key||'';base.value=aiConfig.base||'';aiEl('customBaseWrap').hidden=provider.value!=='custom';fillModels();model.value=aiConfig.model||model.value;renderAIHistory();aiStatus(aiConfig.key?'API ГОТОВ':'OFFLINE');provider.onchange=providerChanged;model.onchange=()=>{aiConfig.model=model.value;saveAI()};key.onchange=()=>{aiConfig.key=key.value.trim();saveAI()};base.onchange=()=>{aiConfig.base=base.value.trim();saveAI()};connect.onclick=connectAI;clear.onclick=()=>{aiConfig.history=[];saveAI();renderAIHistory()};form.onsubmit=e=>{e.preventDefault();const t=input.value.trim();if(!t)return;input.value='';sendALDUINAI(t)};}

function boot(){
  const hide=()=>document.getElementById("loader")?.classList.add("hide");
  try{
    notes=load(KEY.notes,[]);
    loadProfile();
    wire();
    setupALDUINAI();
    renderAll();
    // Local DB opens in the background and never blocks the initial screen.
    openDB().then(()=>dbAll()).then(rows=>{photos=rows||[];renderAll()}).catch(e=>console.warn("Gallery DB unavailable",e));
    // Heavy visual loops start after the first paint.
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      try{startParticles();startFPS()}catch(e){console.warn("FX startup",e)}
    }));
  }catch(e){console.error("ALDUIN startup",e)}
  finally{requestAnimationFrame(hide)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
