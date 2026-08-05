"use strict";

/* ==========================================
   ALDUIN DRAGON EYE
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

const eye=document.querySelector(".dragon-eye");
const iris=document.querySelector(".iris");

if(!eye||!iris)return;

let mouseX=0;
let mouseY=0;

let currentX=0;
let currentY=0;

const maxMove=18;
    /* ==========================================
   POINTER TRACKING
========================================== */

function updatePointer(x,y){

const rect=eye.getBoundingClientRect();

const centerX=rect.left+rect.width/2;
const centerY=rect.top+rect.height/2;

const dx=x-centerX;
const dy=y-centerY;

const distance=Math.sqrt(dx*dx+dy*dy)||1;

mouseX=(dx/distance)*Math.min(maxMove,distance/18);
mouseY=(dy/distance)*Math.min(maxMove,distance/18);

}

/* ---------- Мышь ---------- */

window.addEventListener("mousemove",(e)=>{

updatePointer(e.clientX,e.clientY);

});

/* ---------- Палец ---------- */

window.addEventListener("touchmove",(e)=>{

const touch=e.touches[0];

if(!touch)return;

updatePointer(touch.clientX,touch.clientY);

},{passive:true});
    /* ==========================================
   SMOOTH MOVEMENT
========================================== */

function animateEye(){

currentX+=(mouseX-currentX)*0.12;
currentY+=(mouseY-currentY)*0.12;

iris.style.transform=

`translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;

requestAnimationFrame(animateEye);

}

requestAnimationFrame(animateEye);

/* ==========================================
   RETURN TO CENTER
========================================== */

window.addEventListener("mouseleave",()=>{

mouseX=0;
mouseY=0;

});

window.addEventListener("touchend",()=>{

mouseX=0;
mouseY=0;

});

window.addEventListener("touchcancel",()=>{

mouseX=0;
mouseY=0;

});
    /* ==========================================
   AUTO BLINK
========================================== */

function blink(){

iris.animate(

[

{transform:`translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scaleY(1)`},

{transform:`translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scaleY(0.05)`},

{transform:`translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px)) scaleY(1)`}

],

{

duration:180,

easing:"ease-in-out"

}

);

const nextBlink=3000+Math.random()*5000;

setTimeout(blink,nextBlink);

}

setTimeout(blink,2500);

/* ==========================================
   BREATHING EFFECT
========================================== */

let breath=0;

setInterval(()=>{

breath+=0.05;

eye.style.filter=
`brightness(${1+Math.sin(breath)*0.04})`;

},16);

/* ==========================================
   END
========================================== */

});
