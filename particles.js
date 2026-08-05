const canvas=document.getElementById("particlesCanvas");
const ctx=canvas.getContext("2d");

function resize(){

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

}

resize();

window.addEventListener("resize",resize);

const particles=[];

for(let i=0;i<120;i++){

particles.push({

x:Math.random()*canvas.width,

y:Math.random()*canvas.height,

vx:(Math.random()-.5)*.5,

vy:(Math.random()-.5)*.5,

r:Math.random()*2+1

});

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

for(let p of particles){

ctx.beginPath();

ctx.fillStyle="#b86dff";

ctx.shadowBlur=18;

ctx.shadowColor="#b86dff";

ctx.arc(p.x,p.y,p.r,0,Math.PI*2);

ctx.fill();

p.x+=p.vx;
p.y+=p.vy;

if(p.x<0)p.x=canvas.width;
if(p.x>canvas.width)p.x=0;
if(p.y<0)p.y=canvas.height;
if(p.y>canvas.height)p.y=0;

}

requestAnimationFrame(draw);

}

draw();