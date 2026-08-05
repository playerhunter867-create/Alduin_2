const colors = [
"#180026",
"#22003d",
"#2b0055",
"#180026"
];

let i = 0;

setInterval(() => {
document.body.style.transition = "background 5s ease";
document.body.style.background = colors[i];
i++;
if(i >= colors.length) i = 0;
},5000);