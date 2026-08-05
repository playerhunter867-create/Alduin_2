window.addEventListener("load",()=>{

const blocks=document.querySelectorAll("section,.card,button");

blocks.forEach((el,index)=>{

el.style.opacity="0";
el.style.transform="translateY(30px)";

setTimeout(()=>{

el.style.transition=".8s";
el.style.opacity="1";
el.style.transform="translateY(0)";

},index*120);

});

});