"use strict";

document.addEventListener("DOMContentLoaded", () => {

const input = document.getElementById("imageInput");
const grid = document.getElementById("galleryGrid");

if (!input || !grid) return;

let images = JSON.parse(localStorage.getItem("alduin_gallery") || "[]");

function saveImages() {
    localStorage.setItem("alduin_gallery", JSON.stringify(images));
}

function renderGallery() {

    grid.innerHTML = "";

    images.forEach((src, index) => {

        const img = document.createElement("img");

        img.src = src;
        img.className = "galleryImage";
        img.loading = "lazy";

        img.onclick = () => {

            const viewer = document.getElementById("imageViewer");
            const viewerImage = document.getElementById("viewerImage");

            if (viewer && viewerImage) {
                viewerImage.src = src;
                viewer.classList.remove("hidden");
            }

        };

        img.oncontextmenu = (e) => {

            e.preventDefault();

            if (confirm("Удалить изображение?")) {

                images.splice(index, 1);

                saveImages();

                renderGallery();

            }

        };

        grid.appendChild(img);

    });

}

input.addEventListener("change", (event) => {

    const files = [...event.target.files];

    files.forEach(file => {

        const reader = new FileReader();

        reader.onload = function(e){

            images.push(e.target.result);

            saveImages();

            renderGallery();

        };

        reader.readAsDataURL(file);

    });

    input.value = "";

});

const close = document.getElementById("closeViewer");

if (close) {

    close.onclick = () => {

        document.getElementById("imageViewer").classList.add("hidden");

    };

}

renderGallery();

});