"use strict";

/* ==========================================
   ALDUIN APP
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

const diary=document.getElementById("diaryText");
const saveDiary=document.getElementById("saveDiary");

const profileDescription=document.getElementById("profileDescription");

const notesCount=document.getElementById("notesCount");
const imagesCount=document.getElementById("imagesCount");
const lastDiary=document.getElementById("lastDiary");
const daysTogether=document.getElementById("daysTogether");

const CREATED_DATE=new Date("2026-08-02");

function updateDays(){

const now=new Date();

const diff=now-CREATED_DATE;

const days=Math.max(0,Math.floor(diff/86400000));

if(daysTogether){

daysTogether.textContent=days;

}

}
   /* ==========================================
   DIARY
========================================== */

function loadDiary(){

const text=localStorage.getItem("alduin_diary")||"";

if(diary){

diary.value=text;

}

if(lastDiary){

lastDiary.textContent=

text.length>0

? text.substring(0,120)

: "Пока нет записей...";

}

updateStats();

}

function saveDiaryData(){

if(!diary)return;

localStorage.setItem(

"alduin_diary",

diary.value

);

if(lastDiary){

lastDiary.textContent=

diary.value.length>0

? diary.value.substring(0,120)

: "Пока нет записей...";

}

showToast("Дневник сохранён");

updateStats();

}

if(saveDiary){

saveDiary.addEventListener(

"click",

saveDiaryData

);

}

if(diary){

diary.addEventListener(

"input",

()=>{

localStorage.setItem(

"alduin_diary",

diary.value

);

}

);

}
   /* ==========================================
   PROFILE
========================================== */

function loadProfile(){

const text=localStorage.getItem("alduin_profile")||"";

if(profileDescription){

profileDescription.value=text;

}

}

function saveProfile(){

if(!profileDescription)return;

localStorage.setItem(

"alduin_profile",

profileDescription.value

);

showToast("Профиль сохранён");

}

if(profileDescription){

profileDescription.addEventListener(

"input",

()=>{

localStorage.setItem(

"alduin_profile",

profileDescription.value

);

}

);

}

/* ==========================================
   STATS
========================================== */

function updateStats(){

if(notesCount){

const diaryText=

localStorage.getItem("alduin_diary")||"";

notesCount.textContent=

diaryText.trim().length>0 ? 1 : 0;

}

if(imagesCount){

const images=

JSON.parse(

localStorage.getItem("alduin_gallery")||"[]"

);

imagesCount.textContent=images.length;

}

}

/* ==========================================
   TOAST
========================================== */

function showToast(text){

const toast=document.getElementById("toast");

if(!toast)return;

toast.textContent=text;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}
   /* ==========================================
   INITIALIZE
========================================== */

loadDiary();

loadProfile();

updateStats();

updateDays();

/* ==========================================
   AUTO SAVE
========================================== */

setInterval(()=>{

updateStats();

updateDays();

},60000);

/* ==========================================
   EXPORT
========================================== */

window.showToast=showToast;

/* ==========================================
   APP READY
========================================== */

console.log("🐉 ALDUIN APP READY");

/* ==========================================
   END
========================================== */

});
