"use strict";

/* ==========================================
   ALDUIN FOG
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

const fog=document.getElementById("backgroundFog");

if(!fog)return;

let offset=0;

let direction=1;
  /* ==========================================
   FOG ANIMATION
========================================== */

function animateFog(){

offset += 0.003 * direction;

const x = Math.sin(offset) * 35;
const opacity = 0.55 + Math.sin(offset * 0.6) * 0.12;

fog.style.transform = `translateX(${x}px)`;
fog.style.opacity = opacity;

requestAnimationFrame(animateFog);

}

animateFog();

/* ==========================================
   CHANGE DIRECTION
========================================== */

setInterval(()=>{

direction *= -1;

},30000);

/* ==========================================
   END
========================================== */

});
