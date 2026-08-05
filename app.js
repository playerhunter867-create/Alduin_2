/* =======================================
   ALDUIN APP ENGINE
======================================= */

const pages = document.querySelectorAll(".page");
const buttons = document.querySelectorAll(".navButton");

function showPage(page){

pages.forEach(p=>{

p.classList.remove("active");

});

buttons.forEach(b=>{

b.classList.remove("active");

});

const current=document.getElementById(page);

if(current){

current.classList.add("active");

}

const btn=document.querySelector(`[data-page="${page}"]`);

if(btn){

btn.classList.add("active");

}

window.scrollTo({

top:0,

behavior:"smooth"

});

}

/* =======================================
   ЗАГРУЗКА
======================================= */

window.addEventListener("load",()=>{

const loader=document.getElementById("loader");

const app=document.getElementById("app");

setTimeout(()=>{

loader.classList.add("hide");

setTimeout(()=>{

loader.style.display="none";

app.style.display="block";

},900);

},1800);

});

/* =======================================
   ДНЕВНИК
======================================= */

const diary=document.getElementById("diaryText");

if(localStorage.getItem("alduinDiary")){

diary.value=localStorage.getItem("alduinDiary");

}

diary.addEventListener("input",()=>{

localStorage.setItem(

"alduinDiary",

diary.value

);

updateDiary();

});

/* =======================================
   СЧЕТЧИК ДНЕЙ
======================================= */

const created=new Date("2026-08-02");

const today=new Date();

const days=Math.floor(

(today-created)/(1000*60*60*24)

);

const daysSpan=document.getElementById("daysTogether");

if(daysSpan){

daysSpan.textContent=Math.max(days,0);

}
/* =======================================
   ГАЛЕРЕЯ ALDUIN
======================================= */

const imageInput=document.getElementById("imageInput");
const gallery=document.getElementById("galleryGrid");
const viewer=document.getElementById("imageViewer");
const viewerImage=document.getElementById("viewerImage");
const closeViewer=document.getElementById("closeViewer");

let images=JSON.parse(
localStorage.getItem("alduinGallery")||"[]"
);

function saveGallery(){

localStorage.setItem(

"alduinGallery",

JSON.stringify(images)

);

const counter=document.getElementById("imagesCount");

if(counter){

counter.textContent=images.length;

}

}

function renderGallery(){

gallery.innerHTML="";

images.forEach((src,index)=>{

const img=document.createElement("img");

img.src=src;

img.loading="lazy";

img.onclick=()=>{

viewer.classList.add("show");

viewerImage.src=src;

};

img.oncontextmenu=(e)=>{

e.preventDefault();

if(confirm("Удалить фотографию?")){

images.splice(index,1);

saveGallery();

renderGallery();

}

};

gallery.appendChild(img);

});

}

if(imageInput){

imageInput.addEventListener("change",(e)=>{

const files=[...e.target.files];

files.forEach(file=>{

const reader=new FileReader();

reader.onload=()=>{

images.push(reader.result);

saveGallery();

renderGallery();

};

reader.readAsDataURL(file);

});

});

}

if(closeViewer){

closeViewer.onclick=()=>{

viewer.classList.remove("show");

};

}

if(viewer){

viewer.onclick=(e)=>{

if(e.target===viewer){

viewer.classList.remove("show");

}

};

}

renderGallery();
/* =======================================
   МУЗЫКА
======================================= */

const music=document.getElementById("bgMusic");
const musicButton=document.getElementById("musicButton");

let musicEnabled=
localStorage.getItem("musicEnabled")==="true";

if(music){

music.volume=0.35;

if(musicEnabled){

music.play().catch(()=>{});

}

}

if(musicButton){

updateMusicButton();

musicButton.onclick=()=>{

musicEnabled=!musicEnabled;

localStorage.setItem(

"musicEnabled",

musicEnabled

);

if(musicEnabled){

music.play().catch(()=>{});

}else{

music.pause();

}

updateMusicButton();

};

}

function updateMusicButton(){

if(!musicButton)return;

musicButton.textContent=

musicEnabled?

"🎵 Музыка: ВКЛ"

:

"🔇 Музыка: ВЫКЛ";

}

/* =======================================
   TOAST
======================================= */

const toast=document.getElementById("toast");

function showToast(text){

if(!toast)return;

toast.textContent=text;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}

/* =======================================
   СОХРАНЕНИЕ ДНЕВНИКА
======================================= */

const saveDiary=document.getElementById("saveDiary");

if(saveDiary){

saveDiary.onclick=()=>{

localStorage.setItem(

"alduinDiary",

diary.value

);

showToast("Дневник сохранён");

};

}

/* =======================================
   ПОСЛЕДНЯЯ ЗАПИСЬ
======================================= */

function updateDiary(){

const last=document.getElementById("lastDiary");

const counter=document.getElementById("notesCount");

if(last){

const text=diary.value.trim();

last.textContent=

text.length?

text.substring(0,120):

"Пока нет записей...";

}

if(counter){

counter.textContent=

diary.value.trim().length?1:0;

}

}

updateDiary();

/* =======================================
   ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ
======================================= */

buttons.forEach(btn=>{

btn.addEventListener("click",()=>{

showPage(

btn.dataset.page

);

});

});
/* =======================================
   ЭКСПОРТ И ИМПОРТ
======================================= */

const exportButton=document.getElementById("exportButton");
const importButton=document.getElementById("importButton");

if(exportButton){

exportButton.onclick=()=>{

const data={

version:"ALDUIN V3",

date:new Date().toISOString(),

diary:localStorage.getItem("alduinDiary")||"",

gallery:images,

profile:{

description:

document.getElementById("profileDescription")?.value||""

},

music:musicEnabled

};

const blob=new Blob(

[JSON.stringify(data,null,2)],

{type:"application/json"}

);

const url=URL.createObjectURL(blob);

const a=document.createElement("a");

a.href=url;

a.download="Alduin_Backup.json";

a.click();

URL.revokeObjectURL(url);

showToast("Резервная копия создана");

};

}

if(importButton){

importButton.onclick=()=>{

const input=document.createElement("input");

input.type="file";

input.accept=".json";

input.onchange=(e)=>{

const file=e.target.files[0];

if(!file)return;

const reader=new FileReader();

reader.onload=()=>{

try{

const data=JSON.parse(reader.result);

if(data.diary){

diary.value=data.diary;

localStorage.setItem(

"alduinDiary",

data.diary

);

}

if(Array.isArray(data.gallery)){

images=data.gallery;

saveGallery();

renderGallery();

}

if(data.profile){

const desc=document.getElementById("profileDescription");

if(desc){

desc.value=data.profile.description||"";

}

}

showToast("Данные восстановлены");

updateDiary();

}catch{

showToast("Ошибка импорта");

}

};

reader.readAsText(file);

};

input.click();

};

}

/* =======================================
   ПРОФИЛЬ
======================================= */

const profileDescription=document.getElementById("profileDescription");

if(profileDescription){

profileDescription.value=

localStorage.getItem("profileDescription")||"";

profileDescription.oninput=()=>{

localStorage.setItem(

"profileDescription",

profileDescription.value

);

};

}

/* =======================================
   КРАСИВОЕ ПОЯВЛЕНИЕ КАРТОЧЕК
======================================= */

function animateCards(){

const cards=document.querySelectorAll(".card");

cards.forEach((card,index)=>{

card.animate([

{

opacity:0,

transform:"translateY(30px)"

},

{

opacity:1,

transform:"translateY(0px)"

}

],{

duration:500,

delay:index*120,

fill:"forwards"

});

});

}

animateCards();
