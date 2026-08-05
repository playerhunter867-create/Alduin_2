const dragon=document.querySelector(".dragon");

document.addEventListener("mousemove",(e)=>{

const x=(e.clientX/window.innerWidth-.5)*20;
const y=(e.clientY/window.innerHeight-.5)*20;

dragon.style.transform=
`translate(${x/3}px,${y/3}px)`;

});