var door_hp = 0;

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
    document.getElementById("en3").style.display = "none";
    document.getElementById("enout").style.display = "none";
    document.getElementById("ad").style.display = "none";
    document.getElementById("eg").style.display = "none";

    if(comand == 0) {
        //load splash screen
        //setTimeout(toggleFade, 2000);
        setTimeout(function(){ document.getElementById("ss").style.display = "block" }, 1500);
        setTimeout(function(){ document.getElementById("ss").style.display = "none" }, 3500);
        
        setTimeout(function(){ document.getElementById("mm").style.display = "block" }, 4500);
        //document.getElementById("ss").style.display = "block";
    }

    if(comand == 1) {
        //load class select
        document.getElementById("cs").style.display = "block";
    }

    if(comand == 2) {
        //load dungeon
        document.getElementById("cl_h_tit").innerHTML = "Loading...";
        document.getElementById("cl_p_diag").innerHTML = "Creating your adventure";
        document.getElementById("cl_st_bttn").style.display = "none";
        document.getElementById("cl").style.display = "block";
        setTimeout(function(){ document.getElementById("cl_h_tit").innerHTML = "Ready To Embark" }, 4500);
        setTimeout(function(){ document.getElementById("cl_p_diag").innerHTML = "Your adventure awaits!" }, 4500);
        setTimeout(function(){ document.getElementById("cl_st_bttn").style.display = "block" }, 4500);
    }

    if(comand == 3) {
        document.getElementById("dr").style.display = "block";
        Core_Door_Randomizer(0);
    }

    if(comand == 4) {
        //tic tac toe
    }

    if(comand == 5) {
        //rock paper scissors
    }

    if(comand == 6) {
        //whack a mole ish
    }

    if(comand == 7) {
        //the battle encounter function
    }
}

function Core_Door_Randomizer(fun) {
    
    document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;

    if(fun == 0) {
        door_hp = Math.floor(Math.random() * 10) + 1;
        document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;
    }

    if(fun == 1) {
        if(door_hp >= 1) {
            door_hp -= 1;
            document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;
        }

        if(door_hp <= 0) {
            door_hp = 0;
            document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;
            alert("opening door!");

        }
    }
}

function Core_World_Generator () {
    
}