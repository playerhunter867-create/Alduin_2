/* ==========================================
   ALDUIN APP
========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

const app = document.getElementById("app");
const loader = document.getElementById("loader");

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll(".navButton");

/* ==========================================
   LOADER
========================================== */

setTimeout(() => {

if (loader) {

loader.classList.add("hide");

setTimeout(() => {

loader.style.display = "none";

}, 700);

}

if (app) {

app.style.display = "block";

}

}, 1500);

/* ==========================================
   PAGE SWITCH
========================================== */

function showPage(pageId){

pages.forEach(page=>{

page.classList.remove("active");

});

const current=document.getElementById(pageId);

if(current){

current.classList.add("active");

}

navButtons.forEach(btn=>{

btn.classList.remove("active");

if(btn.dataset.page===pageId){

btn.classList.add("active");

}

});

localStorage.setItem("currentPage",pageId);

}

window.showPage=showPage;

/* ==========================================
   NAVIGATION
========================================== */

navButtons.forEach(button=>{

button.addEventListener("click",()=>{

showPage(button.dataset.page);

});

});

const lastPage=localStorage.getItem("currentPage")||"home";

showPage(lastPage);
   /* ==========================================
   DIARY
========================================== */

const diaryText = document.getElementById("diaryText");

const lastDiaryText = document.getElementById("lastDiaryText");

const homeLastDiary = document.getElementById("homeLastDiary");

const saveDiary = document.getElementById("saveDiary");

const savedDiary = localStorage.getItem("diary") || "";

if (diaryText) {

diaryText.value = savedDiary;

}

if (lastDiaryText) {

lastDiaryText.textContent = savedDiary || "Записей пока нет...";

}

if (homeLastDiary) {

homeLastDiary.textContent = savedDiary || "Пока нет записей...";

}

function saveDiaryData() {

const text = diaryText.value.trim();

localStorage.setItem("diary", text);

if (lastDiaryText) {

lastDiaryText.textContent = text || "Записей пока нет...";

}

if (homeLastDiary) {

homeLastDiary.textContent = text || "Пока нет записей...";

}

showToast("Дневник сохранён");

}

if (saveDiary) {

saveDiary.addEventListener("click", saveDiaryData);

}

if (diaryText) {

diaryText.addEventListener("input", () => {

localStorage.setItem("diary", diaryText.value);

});

}

/* ==========================================
   PROFILE
========================================== */

const profileDescription = document.getElementById("profileDescription");

const saveProfile = document.getElementById("saveProfile");

if (profileDescription) {

profileDescription.value =

localStorage.getItem("profileDescription") || "";

}

if (saveProfile) {

saveProfile.addEventListener("click", () => {

localStorage.setItem(

"profileDescription",

profileDescription.value

);

showToast("Профиль сохранён");

});

}
   /* ==========================================
   TOAST
========================================== */

const toast = document.getElementById("toast");

function showToast(text){

if(!toast) return;

toast.textContent=text;

toast.classList.add("show");

clearTimeout(window.toastTimer);

window.toastTimer=setTimeout(()=>{

toast.classList.remove("show");

},2200);

}

/* ==========================================
   MUSIC
========================================== */

const bgMusic=document.getElementById("bgMusic");

const musicButton=document.getElementById("musicButton");

let musicEnabled=
localStorage.getItem("musicEnabled")==="true";

if(bgMusic){

bgMusic.volume=0.35;

if(musicEnabled){

bgMusic.play().catch(()=>{});

}

}

if(musicButton){

musicButton.addEventListener("click",()=>{

musicEnabled=!musicEnabled;

localStorage.setItem("musicEnabled",musicEnabled);

if(musicEnabled){

bgMusic.play().catch(()=>{});

showToast("Музыка включена");

}else{

bgMusic.pause();

showToast("Музыка выключена");

}

});

}

/* ==========================================
   PROFILE PHOTO
========================================== */

const profileImageInput=
document.getElementById("profileImageInput");

const profilePhoto=
document.getElementById("profilePhoto");

const savedPhoto=
localStorage.getItem("profilePhoto");

if(savedPhoto && profilePhoto){

profilePhoto.src=savedPhoto;

}

if(profileImageInput){

profileImageInput.addEventListener("change",(e)=>{

const file=e.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(){

profilePhoto.src=reader.result;

localStorage.setItem(

"profilePhoto",

reader.result

);

showToast("Фото сохранено");

};

reader.readAsDataURL(file);

});

}
   /* ==========================================
   STATISTICS
========================================== */

const daysTogether =
document.getElementById("daysTogether");

const notesCount =
document.getElementById("notesCount");

const imagesCount =
document.getElementById("imagesCount");

function updateStats(){

const created =
new Date("2026-08-02");

const now =
new Date();

const days =
Math.max(
1,
Math.floor(
(now-created)/86400000
)+1
);

if(daysTogether){

daysTogether.textContent=days;

}

if(notesCount){

const diary =
localStorage.getItem("diary")||"";

notesCount.textContent =
diary.trim()===""
?0
:1;

}

if(imagesCount){

let total=0;

for(let i=0;i<localStorage.length;i++){

const key=
localStorage.key(i);

if(key.startsWith("gallery_")){

total++;

}

}

imagesCount.textContent=total;

}

}

updateStats();

/* ==========================================
   EXPORT
========================================== */

const exportButton =
document.getElementById("exportButton");

if(exportButton){

exportButton.addEventListener("click",()=>{

const data={};

for(let i=0;i<localStorage.length;i++){

const key=localStorage.key(i);

data[key]=localStorage.getItem(key);

}

const blob=new Blob(

[JSON.stringify(data,null,2)],

{type:"application/json"}

);

const a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="alduin_backup.json";

a.click();

showToast("Экспорт завершён");

});

}

/* ==========================================
   CLEAR
========================================== */

const clearButton=
document.getElementById("clearButton");

if(clearButton){

clearButton.addEventListener("click",()=>{

if(!confirm("Удалить все данные?")){

return;

}

localStorage.clear();

location.reload();

});

    /* ==========================================
   IMPORT
========================================== */

const importButton =
document.getElementById("importButton");

if(importButton){

const input=document.createElement("input");

input.type="file";

input.accept=".json";

importButton.addEventListener("click",()=>{

input.click();

});

input.addEventListener("change",(e)=>{

const file=e.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(){

try{

const data=JSON.parse(reader.result);

localStorage.clear();

Object.keys(data).forEach(key=>{

localStorage.setItem(key,data[key]);

});

showToast("Импорт завершён");

setTimeout(()=>{

location.reload();

},1000);

}catch{

showToast("Ошибка импорта");

}

};

reader.readAsText(file);

});

}

/* ==========================================
   IMAGE VIEWER
========================================== */

const viewer =
document.getElementById("imageViewer");

const viewerImage =
document.getElementById("viewerImage");

const closeViewer =
document.getElementById("closeViewer");

document.addEventListener("click",(e)=>{

if(e.target.tagName==="IMG" &&
e.target.closest(".galleryGrid")){

viewerImage.src=e.target.src;

viewer.classList.add("show");

}

});

if(closeViewer){

closeViewer.addEventListener("click",()=>{

viewer.classList.remove("show");

});

}

if(viewer){

viewer.addEventListener("click",(e)=>{

if(e.target===viewer){

viewer.classList.remove("show");

}

});

}

/* ==========================================
   PERFORMANCE
========================================== */

document.body.style.visibility="visible";

window.addEventListener("pageshow",()=>{

updateStats();

});

/* ==========================================
   END
========================================== */

});                                         }
