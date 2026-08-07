(() => {
"use strict";
const $ = id => document.getElementById(id);
const KEY = {
 login:"alduin_login_v3", diary:"alduin_diary_v3", draft:"alduin_draft_v3",
 profile:"alduin_profile_v3", profilePhoto:"alduin_profile_photo_v3",
 music:"alduin_music_v3", effects:"alduin_effects_v3"
};
const PASSWORD = "ALDUIN2026";
const CREATED = new Date("2026-08-02T00:00:00");
let diaries = [], currentDiaryId = null, gallery = [], viewerIndex = 0, confirmAction = null;
let db = null;

const safeJSON = (v,f) => { try{return v?JSON.parse(v):f}catch{return f} };
const toast = text => { const e=$("toast"); if(!e)return; e.textContent=text;e.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove("show"),2400); };

function openDB(){
 return new Promise((resolve,reject)=>{
   const req=indexedDB.open("ALDUIN_ULTIMATE_DB",1);
   req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains("images"))d.createObjectStore("images",{keyPath:"id"});};
   req.onsuccess=()=>{db=req.result;resolve(db)}; req.onerror=()=>reject(req.error);
 });
}
function tx(store,mode="readonly"){return db.transaction(store,mode).objectStore(store)}
function dbGetAll(){return new Promise((res,rej)=>{const r=tx("images").getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error)})}
function dbPut(v){return new Promise((res,rej)=>{const r=tx("images","readwrite").put(v);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function dbDelete(id){return new Promise((res,rej)=>{const r=tx("images","readwrite").delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
const uid=()=>crypto.randomUUID?.() || Date.now()+"_"+Math.random().toString(16).slice(2);

function initLogin(){
 const screen=$("loginScreen"), input=$("passwordInput"), err=$("loginError");
 $("togglePassword")?.addEventListener("click",()=>input.type=input.type==="password"?"text":"password");
 const login=()=>{
   if(input.value===PASSWORD){
     if($("rememberLogin").checked) localStorage.setItem(KEY.login,"1"); else sessionStorage.setItem(KEY.login,"1");
     screen.classList.add("hidden"); $("app").classList.remove("hidden"); setTimeout(()=>startApp(),80);
   }else{err.textContent="Неверный пароль. Попробуй ещё раз.";input.classList.remove("shake");void input.offsetWidth;input.classList.add("shake");input.select()}
 };
 $("loginButton")?.addEventListener("click",login);input?.addEventListener("keydown",e=>e.key==="Enter"&&login());
 $("logoutButton")?.addEventListener("click",()=>{localStorage.removeItem(KEY.login);sessionStorage.removeItem(KEY.login);location.reload()});
 if(localStorage.getItem(KEY.login)==="1"||sessionStorage.getItem(KEY.login)==="1"){screen.classList.add("hidden");$("app").classList.remove("hidden");setTimeout(startApp,80)}
}
async function startApp(){
 await openDB().catch(()=>{});
 loadState(); renderDiaryList(); await loadGallery(); renderGallery(); updateAll();
 registerSW();
 setTimeout(()=>$("boot").classList.add("hide"),120);
}

const pageMeta={
 home:["HOME","Добро пожаловать"],diary:["DIARY","Дневник"],gallery:["GALLERY","Галерея"],profile:["PROFILE","Профиль Alduin"],settings:["SYSTEM","Настройки"]
};
function showPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));
 document.querySelectorAll(".navItem").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
 const m=pageMeta[id]||pageMeta.home;$("crumbName").textContent=m[0];$("pageTitle").textContent=m[1];
 scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".navItem").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.go)));
$("mobileMenu")?.addEventListener("click",()=>showPage("settings"));

function loadState(){
 diaries=safeJSON(localStorage.getItem(KEY.diary),[]);
 const draft=safeJSON(localStorage.getItem(KEY.draft),{title:"",text:""});
 $("diaryTitle").value=draft.title||"";$("diaryText").value=draft.text||"";
 const p=safeJSON(localStorage.getItem(KEY.profile),{description:""});
 $("profileDescription").value=p.description||"";
 const pp=localStorage.getItem(KEY.profilePhoto);if(pp)$("profilePhoto").src=pp;
 effectsOn=localStorage.getItem(KEY.effects)!=="0";musicOn=localStorage.getItem(KEY.music)==="1";updateMusicUI();updateEffectsUI();
}
function updateDiaryDraft(){
 const title=$("diaryTitle").value,text=$("diaryText").value;
 localStorage.setItem(KEY.draft,JSON.stringify({title,text,at:Date.now()}));
 const words=text.trim()?text.trim().split(/\s+/).length:0;$("wordCount").textContent=words+" "+(words===1?"слово":"слов");
 $("draftState").textContent="● Черновик сохранён";
}
$("diaryTitle").addEventListener("input",updateDiaryDraft);$("diaryText").addEventListener("input",updateDiaryDraft);
function saveDiary(){
 const title=$("diaryTitle").value.trim()||"Без названия",text=$("diaryText").value.trim();
 if(!text){toast("Напиши что-нибудь в запись");return}
 const item={id:currentDiaryId||uid(),title,text,date:Date.now()};
 const i=diaries.findIndex(x=>x.id===item.id);if(i>=0)diaries[i]=item;else diaries.unshift(item);
 localStorage.setItem(KEY.diary,JSON.stringify(diaries));currentDiaryId=item.id;renderDiaryList();updateAll();toast("📖 Запись сохранена");
}
$("saveDiary").addEventListener("click",saveDiary);
$("newDiary").addEventListener("click",()=>{currentDiaryId=null;$("diaryTitle").value="";$("diaryText").value="";updateDiaryDraft();toast("Новый черновик")});
function renderDiaryList(){
 const box=$("diaryList");box.innerHTML="";$("diaryCountBadge").textContent=diaries.length;
 if(!diaries.length){box.innerHTML='<div class="emptyText">Архив пока пуст.</div>';return}
 diaries.forEach(d=>{
   const el=document.createElement("div");el.className="diaryEntry"+(d.id===currentDiaryId?" active":"");
   el.innerHTML=`<strong>${escapeHTML(d.title)}</strong><span>${new Date(d.date).toLocaleString("ru-RU",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</span>`;
   el.onclick=()=>{currentDiaryId=d.id;$("diaryTitle").value=d.title;$("diaryText").value=d.text;updateDiaryDraft();renderDiaryList();showPage("diary")};
   box.appendChild(el);
 });
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}

async function loadGallery(){
 gallery=await dbGetAll().catch(()=>[]);
 if(!gallery.length){
   const old=safeJSON(localStorage.getItem("alduin_gallery"),[]);
   if(Array.isArray(old)&&old.length){for(const src of old){await dbPut({id:uid(),name:"Imported image",src,date:Date.now()})};gallery=await dbGetAll()}
 }
}
async function addImages(files){
 for(const file of files){
   if(!file.type.startsWith("image/"))continue;
   const src=await fileToDataURL(file);
   await dbPut({id:uid(),name:file.name,src,date:Date.now(),size:file.size});
 }
 gallery=await dbGetAll();renderGallery();updateAll();toast("🖼️ Изображения добавлены");
}
function fileToDataURL(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsDataURL(file)})}
$("imageInput").addEventListener("change",e=>{addImages([...e.target.files]);e.target.value=""});
$("gallerySearch").addEventListener("input",renderGallery);$("gallerySort").addEventListener("change",renderGallery);
function filteredGallery(){
 const q=$("gallerySearch").value.trim().toLowerCase(),sort=$("gallerySort").value;
 let a=gallery.filter(x=>!q||x.name.toLowerCase().includes(q));
 return a.sort((x,y)=>sort==="old"?x.date-y.date:sort==="name"?x.name.localeCompare(y.name):y.date-x.date)
}
function renderGallery(){
 const box=$("galleryGrid");box.innerHTML="";const list=filteredGallery();$("galleryEmpty").classList.toggle("hidden",list.length>0);
 list.forEach((item)=>{
   const el=document.createElement("article");el.className="galleryCard";
   const img=document.createElement("img");img.src=item.src;img.alt=item.name;img.loading="lazy";
   img.onclick=()=>openViewer(item.id);
   const meta=document.createElement("div");meta.className="galleryMeta";meta.innerHTML=`<span>${escapeHTML(item.name)}</span>`;
   const del=document.createElement("button");del.className="deletePhoto";del.textContent="🗑";del.onclick=e=>{e.stopPropagation();openModal("Удалить изображение?","Оно будет удалено из локального хранилища.",async()=>{await dbDelete(item.id);gallery=await dbGetAll();renderGallery();updateAll();toast("Изображение удалено")})};
   el.append(img,meta,del);box.appendChild(el);
 });
}
function openViewer(id){
 viewerIndex=gallery.findIndex(x=>x.id===id);if(viewerIndex<0)return;showViewer();
}
function showViewer(){const item=gallery[viewerIndex];if(!item)return;$("viewerImage").src=item.src;$("viewerCaption").textContent=item.name;$("viewer").classList.remove("hidden")}
function closeViewer(){$("viewer").classList.add("hidden");$("viewerImage").src=""}
function stepViewer(n){if(!gallery.length)return;viewerIndex=(viewerIndex+n+gallery.length)%gallery.length;showViewer()}
$("viewerClose").onclick=closeViewer;$("viewerPrev").onclick=()=>stepViewer(-1);$("viewerNext").onclick=()=>stepViewer(1);
$("viewer").addEventListener("click",e=>e.target===$("viewer")&&closeViewer());
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeViewer();closeModal()}if(!$("viewer").classList.contains("hidden")){if(e.key==="ArrowLeft")stepViewer(-1);if(e.key==="ArrowRight")stepViewer(1)}});

$("profileDescription").addEventListener("input",()=>localStorage.setItem(KEY.profile,JSON.stringify({description:$("profileDescription").value})));
$("saveProfile").addEventListener("click",()=>{localStorage.setItem(KEY.profile,JSON.stringify({description:$("profileDescription").value}));toast("👑 Профиль сохранён")});
$("profileImageInput").addEventListener("change",async e=>{const f=e.target.files?.[0];if(!f)return;const src=await fileToDataURL(f);localStorage.setItem(KEY.profilePhoto,src);$("profilePhoto").src=src;toast("📷 Изображение профиля обновлено");e.target.value=""});

let musicOn=false;
function updateMusicUI(){const text=musicOn?"ВКЛ":"ВЫКЛ";$("musicButton").textContent=text;$("musicButton").classList.toggle("on",musicOn);$("quickMusic").textContent=musicOn?"♫":"♩"}
async function toggleMusic(){const a=$("bgMusic");musicOn=!musicOn;localStorage.setItem(KEY.music,musicOn?"1":"0");if(musicOn){try{await a.play()}catch{toast("Нажми ещё раз для запуска музыки")}}else a.pause();updateMusicUI()}
$("musicButton").addEventListener("click",toggleMusic);$("quickMusic").addEventListener("click",toggleMusic);

let effectsOn=true;
function updateEffectsUI(){$("effectsButton").textContent=effectsOn?"ВКЛ":"ВЫКЛ";$("effectsButton").classList.toggle("on",effectsOn)}
$("effectsButton").addEventListener("click",()=>{effectsOn=!effectsOn;localStorage.setItem(KEY.effects,effectsOn?"1":"0");updateEffectsUI();initParticles()});

$("exportButton").addEventListener("click",async()=>{
 const data={version:"ALDUIN-ULTIMATE-1",exportedAt:new Date().toISOString(),diaries,profile:safeJSON(localStorage.getItem(KEY.profile),{}),profilePhoto:localStorage.getItem(KEY.profilePhoto)||"",images:await dbGetAll().catch(()=>[]),settings:{music:musicOn,effects:effectsOn}};
 const blob=new Blob([JSON.stringify(data)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="ALDUIN_ULTIMATE_BACKUP.json";a.click();URL.revokeObjectURL(url);toast("📦 Резервная копия готова")
});
$("importButton").addEventListener("click",()=>{const input=document.createElement("input");input.type="file";input.accept=".json,application/json";input.onchange=async e=>{const f=e.target.files?.[0];if(!f)return;try{const d=JSON.parse(await f.text());if(Array.isArray(d.diaries)){diaries=d.diaries;localStorage.setItem(KEY.diary,JSON.stringify(diaries))}if(d.profile)localStorage.setItem(KEY.profile,JSON.stringify(d.profile));if(d.profilePhoto)localStorage.setItem(KEY.profilePhoto,d.profilePhoto);if(Array.isArray(d.images))for(const x of d.images)await dbPut(x);loadState();await loadGallery();renderDiaryList();renderGallery();updateAll();toast("📥 Данные восстановлены")}catch{toast("❌ Не удалось импортировать файл")}};input.click()});
$("clearButton").addEventListener("click",()=>openModal("Очистить данные?","Будут удалены дневник, галерея и профиль. Это нельзя отменить.",async()=>{diaries=[];localStorage.removeItem(KEY.diary);localStorage.removeItem(KEY.draft);localStorage.removeItem(KEY.profile);localStorage.removeItem(KEY.profilePhoto);for(const x of await dbGetAll())await dbDelete(x.id);loadState();await loadGallery();renderDiaryList();renderGallery();updateAll();toast("Данные очищены")}));

function openModal(title,text,action){$("modalTitle").textContent=title;$("modalText").textContent=text;confirmAction=action;$("modal").classList.remove("hidden")}
function closeModal(){$("modal").classList.add("hidden");confirmAction=null}
$("modalNo").onclick=closeModal;$("modalYes").onclick=async()=>{const a=confirmAction;closeModal();await a?.()};

function updateAll(){
 const days=Math.max(0,Math.floor((Date.now()-CREATED)/86400000));$("daysTogether").textContent=days;$("notesCount").textContent=diaries.length;$("imagesCount").textContent=gallery.length;
 const latest=diaries[0];const h=$("homeLastDiary");h.classList.toggle("emptyText",!latest);h.textContent=latest?latest.text:"Пока нет записей. Создай первую.";
 const words=$("diaryText").value.trim().split(/\s+/).filter(Boolean).length;$("wordCount").textContent=words+" "+(words===1?"слово":"слов");
}

let raf=0,parts=[],last=performance.now(),frames=0,refreshEstimate=60;
function detectRefresh(){
 let samples=0,total=0,prev=performance.now();
 const sample=t=>{total+=t-prev;prev=t;samples++;if(samples<45)requestAnimationFrame(sample);else{refreshEstimate=Math.max(30,Math.round(1000/(total/(samples-1))));$("refreshRate").textContent=refreshEstimate+" Hz";$("settingsRefresh").textContent=refreshEstimate+" Hz"}};
 requestAnimationFrame(sample);
}
function initParticles(){
 cancelAnimationFrame(raf);parts=[];if(!effectsOn||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
 const area=innerWidth*innerHeight,count=Math.min(110,Math.max(34,Math.floor(area/15000)));
 for(let i=0;i<count;i++)parts.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.12,r:.5+Math.random()*1.4,a:.15+Math.random()*.45});
 drawParticles();
}
function drawParticles(){
 const c=$("particlesCanvas"),ctx=c.getContext("2d");const d=Math.min(devicePixelRatio||1,1.5);
 if(c.width!==Math.floor(innerWidth*d)||c.height!==Math.floor(innerHeight*d)){c.width=Math.floor(innerWidth*d);c.height=Math.floor(innerHeight*d);c.style.width=innerWidth+"px";c.style.height=innerHeight+"px";ctx.setTransform(d,0,0,d,0,0)}
 ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of parts){p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=innerWidth;if(p.x>innerWidth)p.x=0;if(p.y<0)p.y=innerHeight;if(p.y>innerHeight)p.y=0;ctx.globalAlpha=p.a;ctx.fillStyle="#c778ff";ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;raf=requestAnimationFrame(drawParticles);
}
addEventListener("resize",initParticles);
document.addEventListener("visibilitychange",()=>{if(document.hidden)cancelAnimationFrame(raf);else initParticles()});

function registerSW(){if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{})}
initLogin();detectRefresh();setInterval(updateAll,60000);
})();