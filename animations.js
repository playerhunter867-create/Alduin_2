// ALDUIN Smooth Animations

const pages = document.querySelectorAll(".page");
const buttons = document.querySelectorAll("nav button");

function showPage(id){

    pages.forEach(page=>{
        page.classList.remove("active");
    });

    buttons.forEach(btn=>{
        btn.classList.remove("active");
    });

    requestAnimationFrame(()=>{

        const page=document.getElementById(id);

        if(page){

            page.classList.add("active");

        }

        const button=document.querySelector(
            `button[onclick="showPage('${id}')"]`
        );

        if(button){

            button.classList.add("active");

        }

    });

}
