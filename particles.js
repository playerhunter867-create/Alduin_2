"use strict";

/* ==========================================
   ALDUIN PARTICLES
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

const canvas=document.getElementById("particlesCanvas");

if(!canvas)return;

const ctx=canvas.getContext("2d");

let w=window.innerWidth;
let h=window.innerHeight;

canvas.width=w;
canvas.height=h;

const particles=[];

const COUNT=80;
  /* ==========================================
   CREATE PARTICLES
========================================== */

class Particle{

constructor(){

this.reset();

this.y=Math.random()*h;

}

reset(){

this.x=Math.random()*w;

this.y=h+Math.random()*150;

this.size=1+Math.random()*3;

this.speed=0.2+Math.random()*0.8;

this.alpha=0.2+Math.random()*0.8;

this.dx=(Math.random()-0.5)*0.3;

}

update(){

this.y-=this.speed;

this.x+=this.dx;

if(this.y<-20){

this.reset();

}

}

draw(){

ctx.beginPath();

ctx.arc(

this.x,

this.y,

this.size,

0,

Math.PI*2

);

ctx.fillStyle=`rgba(180,100,255,${this.alpha})`;

ctx.shadowBlur=12;

ctx.shadowColor="#b86dff";

ctx.fill();

}

}

for(let i=0;i<COUNT;i++){

particles.push(new Particle());

}
  /* ==========================================
   ANIMATION
========================================== */

function animate(){

ctx.clearRect(0,0,w,h);

for(const particle of particles){

particle.update();

particle.draw();

}

requestAnimationFrame(animate);

}

animate();

/* ==========================================
   RESIZE
========================================== */

window.addEventListener("resize",()=>{

w=window.innerWidth;
h=window.innerHeight;

canvas.width=w;
canvas.height=h;

});

/* ==========================================
   END
========================================== */

});
