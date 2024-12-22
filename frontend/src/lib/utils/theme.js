import { DB } from "../db/local";



export function changeTheme(mode = "dracula"){
    document.body.attributes["data-theme"].value = mode;
    changeClass();
}



function changeClass(){
    DB.get("config").theme == "dark" ? document.body.classList.add("dark") : document.body.classList.remove("dark");
}


// @ts-ignore
window.changeTheme = changeTheme;