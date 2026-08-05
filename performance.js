/* =======================================
   ALDUIN PERFORMANCE ENGINE
======================================= */

const perf = {

fps:0,

last:performance.now(),

frames:0

};

function engine(now){

perf.frames++;

if(now-perf.last>=1000){

perf.fps=perf.frames;

perf.frames=0;

perf.last=now;

// Для проверки можешь посмотреть FPS в консоли
console.log("FPS:",perf.fps);

}

requestAnimationFrame(engine);

}

requestAnimationFrame(engine);

/* =======================================
   ПЛАВНАЯ ПРОКРУТКА
======================================= */

document.documentElement.style.scrollBehavior="smooth";

/* =======================================
   ОПТИМИЗАЦИЯ ТАБОВ
======================================= */

document.addEventListener("visibilitychange",()=>{

if(document.hidden){

console.log("Alduin paused");

}else{

console.log("Alduin resumed");

}

});