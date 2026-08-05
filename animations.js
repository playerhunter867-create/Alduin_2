"use strict";

/* ==========================================
   ALDUIN ANIMATIONS
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

const pages=document.querySelectorAll(".page");

const buttons=document.querySelectorAll(".bottomNav .navButton");

let currentPage="home";

function showPage(id){

if(currentPage===id)return;

pages.forEach(page=>{

page.classList.remove("active");

});

const target=document.getElementById(id);

if(target){

requestAnimationFrame(()=>{

target.classList.add("active");

});

}

buttons.forEach(btn=>{

btn.classList.remove("active");

if(btn.dataset.page===id){

btn.classList.add("active");

}

});

currentPage=id;

}
    /* ==========================================
   BUTTON EVENTS
========================================== */

buttons.forEach(button=>{

button.addEventListener("click",()=>{

const page=button.dataset.page;

if(page){

showPage(page);

}

});

});

/* ==========================================
   SAVE CURRENT PAGE
========================================== */

function saveCurrentPage(){

localStorage.setItem(

"alduin_current_page",

currentPage

);

}

function restoreCurrentPage(){

const saved=

localStorage.getItem(

"alduin_current_page"

);

if(saved){

showPage(saved);

}else{

showPage("home");

}

}

buttons.forEach(button=>{

button.addEventListener("click",saveCurrentPage);

});
    /* ==========================================
   PAGE ANIMATION
========================================== */

function animatePage(page){

page.animate(

[

{

opacity:0,

transform:"translateY(25px)"

},

{

opacity:1,

transform:"translateY(0px)"

}

],

{

duration:350,

easing:"ease-out",

fill:"forwards"

}

);

}

/* ==========================================
   BUTTON EFFECT
========================================== */

buttons.forEach(button=>{

button.addEventListener("pointerdown",()=>{

button.style.transform="scale(0.94)";

});

button.addEventListener("pointerup",()=>{

button.style.transform="";

});

button.addEventListener("pointerleave",()=>{

button.style.transform="";

});

});

/* ==========================================
   UPDATE SHOWPAGE
========================================== */

const oldShowPage = showPage;

showPage = function(id){

oldShowPage(id);

const page=document.getElementById(id);

if(page){

animatePage(page);

}

};
    /* ==========================================
   RESTORE PAGE
========================================== */

restoreCurrentPage();

/* ==========================================
   GLOBAL FUNCTION
========================================== */

window.showPage = showPage;

/* ==========================================
   NAVIGATION ANIMATION
========================================== */

window.addEventListener("pageshow",()=>{

buttons.forEach(button=>{

button.style.transition=

"transform .25s ease, box-shadow .25s ease, opacity .25s ease";

});

});

/* ==========================================
   RIPPLE EFFECT
========================================== */

buttons.forEach(button=>{

button.addEventListener("click",()=>{

button.animate(

[

{transform:"scale(.95)"},

{transform:"scale(1.08)"},

{transform:"scale(1)"}

],

{

duration:250,

easing:"ease-out"

}

);

});

});

/* ==========================================
   END
========================================== */

});
