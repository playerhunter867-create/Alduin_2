document.querySelectorAll("button").forEach(btn=>{

btn.addEventListener("click",()=>{

btn.animate([

{

transform:"scale(.9)"

},

{

transform:"scale(1.05)"

},

{

transform:"scale(1)"

}

],{

duration:300

});

});

});