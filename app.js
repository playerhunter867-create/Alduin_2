// =========================
// Alduin App v1.0
// =========================

// Пароль по умолчанию
const DEFAULT_PASSWORD = "Alduin02082026";

// Элементы
const loginScreen = document.getElementById("loginScreen");
const app = document.getElementById("app");

const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

// Загружаем пароль
let savedPassword =
    localStorage.getItem("alduin_password") || DEFAULT_PASSWORD;

// Если уже входили
if(localStorage.getItem("alduin_logged") === "true"){
    loginScreen.style.display = "none";
    app.style.display = "block";
}

// Вход
loginBtn.onclick = () => {

    if(passwordInput.value === savedPassword){

        localStorage.setItem("alduin_logged","true");

        loginScreen.style.display = "none";
        app.style.display = "block";

    }else{

        loginError.textContent =
            "Неверный пароль.";

    }

};

// =========================
// Навигация
// =========================

const pages = document.querySelectorAll(".page");
const navButtons = document.querySelectorAll("nav button");

navButtons.forEach(button=>{

button.onclick = ()=>{

pages.forEach(page=>page.hidden=true);

document
.getElementById(button.dataset.page)
.hidden=false;

};

}); // =========================
// ДНЕВНИК
// =========================

const diaryText = document.getElementById("diaryText");
const diaryList = document.getElementById("diaryList");
const saveDiary = document.getElementById("saveDiary");

// Загружаем записи
let diary = JSON.parse(localStorage.getItem("alduin_diary")) || [];

// Отрисовка записей
function renderDiary(){

    diaryList.innerHTML = "";

    diary.slice().reverse().forEach((entry,index)=>{

        const card = document.createElement("div");

        card.className = "diaryCard";

        card.innerHTML = `
            <h3>${entry.date}</h3>
            <p>${entry.text}</p>
            <button onclick="deleteDiary(${diary.length-1-index})">
                Удалить
            </button>
        `;

        diaryList.appendChild(card);

    });

}

// Сохранение записи
saveDiary.onclick = ()=>{

    if(diaryText.value.trim()==="") return;

    diary.push({

        date:new Date().toLocaleString(),

        text:diaryText.value

    });

    localStorage.setItem(
        "alduin_diary",
        JSON.stringify(diary)
    );

    diaryText.value="";

    renderDiary();

};

// Удаление записи
function deleteDiary(id){

    diary.splice(id,1);

    localStorage.setItem(
        "alduin_diary",
        JSON.stringify(diary)
    );

    renderDiary();

}

// Первая загрузка
renderDiary();// =========================
// ГАЛЕРЕЯ
// =========================

const imageInput = document.getElementById("imageInput");
const galleryGrid = document.getElementById("galleryGrid");

let gallery =
JSON.parse(localStorage.getItem("alduin_gallery")) || [];

function renderGallery(){

    galleryGrid.innerHTML = "";

    gallery.forEach((image,index)=>{

        const card = document.createElement("div");

        card.className = "galleryCard";

        card.innerHTML = `
            <img src="${image}" alt="Alduin">
            <button onclick="deleteImage(${index})">
                Удалить
            </button>
        `;

        galleryGrid.appendChild(card);

    });

}

imageInput.addEventListener("change",(event)=>{

    const file = event.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = ()=>{

        gallery.push(reader.result);

        localStorage.setItem(
            "alduin_gallery",
            JSON.stringify(gallery)
        );

        renderGallery();

    };

    reader.readAsDataURL(file);

});

function deleteImage(index){

    gallery.splice(index,1);

    localStorage.setItem(
        "alduin_gallery",
        JSON.stringify(gallery)
    );

    renderGallery();

}

renderGallery(); // =========================
// НАСТРОЙКИ
// =========================

// Смена пароля
document.getElementById("changePassword").onclick = () => {

    const newPassword = prompt("Введите новый пароль");

    if (!newPassword || newPassword.length < 4) {
        alert("Пароль должен содержать минимум 4 символа.");
        return;
    }

    localStorage.setItem("alduin_password", newPassword);
    savedPassword = newPassword;

    alert("Пароль успешно изменён!");

};

// Выход
const logoutBtn = document.createElement("button");
logoutBtn.textContent = "Выйти";
document.getElementById("settings").appendChild(logoutBtn);

logoutBtn.onclick = () => {

    localStorage.removeItem("alduin_logged");

    location.reload();

};

// =========================
// ЭКСПОРТ
// =========================

document.getElementById("exportData").onclick = () => {

    const data = {

        diary,

        gallery,

        password: savedPassword

    };

    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        {type:"application/json"}
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Alduin_Backup.json";

    link.click();

};

// =========================
// ИМПОРТ
// =========================

document.getElementById("importData").onclick = () => {

    const input = document.createElement("input");

    input.type = "file";

    input.accept = ".json";

    input.onchange = () => {

        const file = input.files[0];

        const reader = new FileReader();

        reader.onload = () => {

            const data = JSON.parse(reader.result);

            diary = data.diary || [];

            gallery = data.gallery || [];

            savedPassword =
                data.password || DEFAULT_PASSWORD;

            localStorage.setItem(
                "alduin_diary",
                JSON.stringify(diary)
            );

            localStorage.setItem(
                "alduin_gallery",
                JSON.stringify(gallery)
            );

            localStorage.setItem(
                "alduin_password",
                savedPassword
            );

            renderDiary();
            renderGallery();

            alert("Данные успешно восстановлены!");

        };

        reader.readAsText(file);

    };

    input.click();

};

// =========================
// СТАТИСТИКА
// =========================

const created = new Date("2026-08-02");

const today = new Date();

const daysTogether =
Math.floor(
(today-created)/(1000*60*60*24)
);

console.log("Дней вместе:", daysTogether);document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loaded");
});
