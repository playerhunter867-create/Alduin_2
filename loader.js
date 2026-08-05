"use strict";

/* ==========================================
   ALDUIN LOADER
========================================== */

window.addEventListener("load",()=>{

const loader=document.getElementById("loader");
const app=document.getElementById("app");

if(!loader||!app)return;

app.style.display="block";

let finished=false;
   /* ==========================================
   HIDE LOADER
========================================== */

function hideLoader(){

if(finished)return;

finished=true;

loader.classList.add("hide");

setTimeout(()=>{

loader.remove();

},700);

}

/* ==========================================
   START APP
========================================== */

requestAnimationFrame(()=>{

setTimeout(()=>{

hideLoader();

},1800);

});
   /* ==========================================
   FAILSAFE
========================================== */

setTimeout(()=>{

if(!finished){

hideLoader();

}

},5000);

/* ==========================================
   PAGE SHOW
========================================== */

window.addEventListener("pageshow",()=>{

if(!finished){

hideLoader();

}

});

/* ==========================================
   VISIBILITY CHANGE
========================================== */

document.addEventListener("visibilitychange",()=>{

if(document.visibilityState==="visible"&&!finished){

setTimeout(()=>{

hideLoader();

},300);

}

});

/* ==========================================
   END
========================================== */

});
