const iris = document.querySelector(".iris");

let targetX = 0;
let targetY = 0;

let currentX = 0;
let currentY = 0;

document.addEventListener("mousemove",(e)=>{

    const x=(e.clientX/window.innerWidth-0.5)*24;
    const y=(e.clientY/window.innerHeight-0.5)*24;

    targetX=x;
    targetY=y;

});

document.addEventListener("touchmove",(e)=>{

    const t=e.touches[0];

    const x=(t.clientX/window.innerWidth-0.5)*24;
    const y=(t.clientY/window.innerHeight-0.5)*24;

    targetX=x;
    targetY=y;

},{passive:true});

function animate(){

    currentX+=(targetX-currentX)*0.12;
    currentY+=(targetY-currentY)*0.12;

    iris.style.transform=
    `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;

    requestAnimationFrame(animate);

}

animate();

/* Случайное моргание */

function blink(){

    iris.style.transition="transform .08s";

    iris.style.transform+=
    " scaleY(0.05)";

    setTimeout(()=>{

        iris.style.transform=
        `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;

    },120);

    setTimeout(blink,3000+Math.random()*5000);

}

setTimeout(blink,2500);
