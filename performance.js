"use strict";

/* ==========================================
   ALDUIN PERFORMANCE
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

const prefersReducedMotion=
window.matchMedia("(prefers-reduced-motion: reduce)");

let fps=144;

if(prefersReducedMotion.matches){

fps=60;

}

let lastFrame=0;

const interval=1000/fps;
   /* ==========================================
   RAF LIMITER
========================================== */

function loop(time){

if(time-lastFrame>=interval){

lastFrame=time;

}

requestAnimationFrame(loop);

}

requestAnimationFrame(loop);

/* ==========================================
   PAGE VISIBILITY
========================================== */

document.addEventListener("visibilitychange",()=>{

if(document.hidden){

document.body.classList.add("paused");

}else{

document.body.classList.remove("paused");

lastFrame=performance.now();

}

});

/* ==========================================
   RESIZE OPTIMIZATION
========================================== */

let resizeTimer;

window.addEventListener("resize",()=>{

clearTimeout(resizeTimer);

resizeTimer=setTimeout(()=>{

window.dispatchEvent(new Event("alduinResize"));

},150);

});

/* ==========================================
   GPU ACCELERATION
========================================== */

document.body.style.transform="translateZ(0)";
document.body.style.willChange="transform";

/* ==========================================
   READY
========================================== */

console.log("⚡ Performance Engine Ready");

/* ==========================================
   END
========================================== */

});
