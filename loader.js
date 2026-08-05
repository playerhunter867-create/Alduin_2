"use strict";

window.addEventListener("load", () => {

const loader = document.getElementById("loader");
const app = document.getElementById("app");

if (!loader || !app) return;

app.style.display = "block";

requestAnimationFrame(() => {

setTimeout(() => {

loader.classList.add("hide");

}, 1600);

});

});
/* ==========================================
   REMOVE LOADER
========================================== */

const removeLoader = () => {

loader.classList.add("hide");

setTimeout(() => {

loader.remove();

}, 700);

};

setTimeout(removeLoader, 1800);

/* ==========================================
   FAILSAFE
========================================== */

setTimeout(() => {

if (document.body.contains(loader)) {

loader.remove();

}

}, 5000);

});