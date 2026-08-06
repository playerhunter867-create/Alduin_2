"use strict";

/* ==========================================
   ALDUIN LOGIN v2
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

const loginScreen =
document.getElementById("loginScreen");

const passwordInput =
document.getElementById("passwordInput");

const loginButton =
document.getElementById("loginButton");

const loginError =
document.getElementById("loginError");

const loginGreeting =
document.getElementById("loginGreeting");


/* Пароль */

const PASSWORD = "alduin";


/* Проверка */

if(
!loginScreen ||
!passwordInput ||
!loginButton
){
    console.log("Login elements not found");
    return;
}


/* Приветствие */

const greetings = [

"🐉 Добро пожаловать",

"✨ Рада тебя видеть",

"🌙 С возвращением",

"💜 Продолжим?"

];


const randomGreeting =
greetings[
Math.floor(Math.random()*greetings.length)
];


if(loginGreeting){

loginGreeting.textContent =
randomGreeting;

}


/* Автофокус */

setTimeout(()=>{

passwordInput.focus();

},400);



/* Enter */

passwordInput.addEventListener(
"keydown",
(e)=>{

if(e.key==="Enter"){

login();

}

});



/* Кнопка */

loginButton.addEventListener(
"click",
login
);



});
/* ==========================================
   LOGIN FUNCTION
========================================== */

function login(){

const value =
passwordInput.value.trim();


if(value === PASSWORD){


    loginError.textContent = "";


    // сохраняем вход

    localStorage.setItem(
        "alduin_logged",
        "true"
    );


    loginButton.textContent =
    "Вход...";


    loginButton.disabled = true;



    // лёгкая вибрация

    if(navigator.vibrate){

        navigator.vibrate(40);

    }



    // анимация выхода

    loginScreen.style.transition =
    "opacity .35s ease, transform .35s ease";


    loginScreen.style.opacity =
    "0";


    loginScreen.style.transform =
    "scale(1.05)";



    setTimeout(()=>{


        loginScreen.classList.add(
            "hidden"
        );


        loginScreen.style.opacity =
        "";


        loginScreen.style.transform =
        "";


        loginButton.textContent =
        "Войти";


        loginButton.disabled =
        false;


    },350);



}else{


    loginError.textContent =
    "❌ Неверный пароль";


    passwordInput.value =
    "";


    passwordInput.focus();



    // вибрация ошибки

    if(navigator.vibrate){

        navigator.vibrate([
            80,
            50,
            80
        ]);

    }


}

}