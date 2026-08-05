const fog=document.getElementById("backgroundFog");

let offset=0;

function animateFog(){

offset+=0.08;

fog.style.transform=
`translateX(${Math.sin(offset)*20}px)`;

requestAnimationFrame(animateFog);

}

animateFog();