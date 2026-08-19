function Start() {
    //starts the engine and preloads all data into ram
    Engine_Hud(0);
}

function Hud_Effect_Fade() {
    document.getElementById('fadeElement').classList.toggle('fade-out');
}

function Engine_Hud(comand) {
    //controls the Hud and main visuals (essentially a scene changer)
    document.getElementById("ss").style.display = "none";
    document.getElementById("mm").style.display = "none";
    document.getElementById("cs").style.display = "none";
    document.getElementById("cl").style.display = "none";
    document.getElementById("dr").style.display = "none";
    document.getElementById("bs").style.display = "none";
    document.getElementById("en1").style.display = "none";
    document.getElementById("en2").style.display = "none";
    document.getElementById("enout").style.display = "none";
    document.getElementById("ad").style.display = "none";
    document.getElementById("eg").style.display = "none";

    if(comand == 0) {
        //load splash screen
        document.getElementById("ss").style.display = "block";
    }

    if(comand == 1) {
        //load splash screen
        document.getElementById("mm").style.display = "block";
    }
}