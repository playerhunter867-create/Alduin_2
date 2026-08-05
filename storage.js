"use strict";

/* ==========================================
   ALDUIN STORAGE
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

const STORAGE_KEY="alduin_data";

let data={

diary:"",
profile:"",
gallery:[],
settings:{}

};
/* ==========================================
   LOAD
========================================== */

function loadData(){

const saved=localStorage.getItem(STORAGE_KEY);

if(saved){

try{

data=JSON.parse(saved);

}catch(e){

console.error("Storage error:",e);

}

}

}

/* ==========================================
   SAVE
========================================== */

function saveData(){

localStorage.setItem(

STORAGE_KEY,

JSON.stringify(data)

);

}
/* ==========================================
   DIARY
========================================== */

function saveDiary(text){

data.diary=text;

saveData();

}

function loadDiary(){

return data.diary||"";

}

/* ==========================================
   PROFILE
========================================== */

function saveProfile(text){

data.profile=text;

saveData();

}

function loadProfile(){

return data.profile||"";

}
/* ==========================================
   GALLERY
========================================== */

function saveGallery(images){

data.gallery = images;

saveData();

}

function loadGallery(){

return data.gallery || [];

}

/* ==========================================
   SETTINGS
========================================== */

function saveSettings(settings){

data.settings = settings;

saveData();

}

function loadSettings(){

return data.settings || {};

}

/* ==========================================
   INITIALIZE
========================================== */

loadData();

/* ==========================================
   EXPORT
========================================== */

window.StorageAPI = {

saveDiary,
loadDiary,

saveProfile,
loadProfile,

saveGallery,
loadGallery,

saveSettings,
loadSettings

};

/* ==========================================
   READY
========================================== */

console.log("💾 Storage Ready");

/* ==========================================
   END
========================================== */

});