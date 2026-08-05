const eye=document.querySelector(".dragon-eye");
const iris=document.querySelector(".iris");

document.addEventListener("mousemove",(e)=>{

if(!eye)return;

const rect=eye.getBoundingClientRect();

const cx=rect.left+rect.width/2;
const cy=rect.top+rect.height/2;

const dx=(e.clientX-cx)/20;
const dy=(e.clientY-cy)/20;

iris.style.transform=
`translate(${dx}px,${dy}px)`;

});

setInterval(()=>{

iris.style.transition=".15s";
iris.style.transform+=" scaleY(.08)";

setTimeout(()=>{

iris.style.transform=
iris.style.transform.replace(" scaleY(.08)","");

},150);

},6000);