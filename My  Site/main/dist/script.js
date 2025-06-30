document.addEventListener("DOMContentLoaded", function () {
    const user = document.querySelector(".fa-user-circle");
    const briefcase = document.querySelector(".fa-briefcase");
    const folder = document.querySelector(".fa-folder-open");
    const usercol = document.querySelector(".user-column");
    isclicked = "false";
    
    user.addEventListener("click", function () {
        if(isclicked == "false") {
            usercol.style.visibility = "visible";
            isclicked = "true";
        } else {
            usercol.style.visibility = "hidden";
            isclicked = "false";
        }
    });
});
