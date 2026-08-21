var door_hp = 0;

var enemy_nme = ["Ghost","Glarb","Serpant","Golem","Skeleton","Toad","Blob","Ember","Goblin"];
var enemy_hth = [3,4,3,8,4,2,2,2,4];
var enemy_dmg = [3,4,4,6,3,2,4,4,3];
var enemy_arm = [1,2,2,3,1,1,2,1,2];
var enemy_icn = ["&","?","!",".",",","+",";","=","\x5C"];
var enemy_clr = ["white","green","lime","gray","white","olive","purple","orange","green"];

var enemy_type = 0;

var enemy = {
    name: "",
    health: 0,
    max_health: 0,
    status: "Normal"
};

var unlockedClasses = [
    true, true, false, false, false, false, false
];

var player = {
    class: 0,
	lvl: 1,
    hp: 40,  
    dmg: 20,   
    arm: 10, 
	inv: {
        gold: 0,
		pot_lvl: 0,
		pot_health: 0,
		pot_poison: 0,
		pot_armor: 0,
		pot_damage: 0,
        pot_speed: 0,
        food: 3,
        water: 3,
        wood: 0
	}
};

var classes = [
    "Hooman",
    "Fighter",
    "Knight",
    "Alchemist",
    "Theologian",
    "Ranger",
    "Artillerist"
];

var class_colors = [
    "white", "red", "purple", "blue", "lime", "yellow", "magenta"
];

var class_health = [0, 15, 18, 8,  15, 12, 10];
var class_damage = [0, 6,  5,  7,  3,  5,  9];
var class_armor  = [0, 12, 18, 0,  8,  5,  3];

var class_unique_weapon = ["None", "Zweihandler", "Long Sword", "Chemicals", "Mace", "Long Bow", "Mortar"];
var class_unique_armor  = ["None", "Field Plate", "Gothic Plate", "Simple Clothes", "Brigandine", "Leather Coat", "Heavy Canvas"];
var class_unique_shield = ["None", "None", "Kite", "None", "Heater", "None", "None"];

var class_data = {
    1: { name: "Fighter", description: "High Health/Strength (Balanced Tank)" },
    2: { name: "Knight", description: "Durable Tank (Maximum Armor & Shielding)" },
    3: { name: "Alchemist", description: "Pure Academic (High Damage Glass Cannon)" },
    4: { name: "Theologian", description: "Durable Backline Support & Protector" },
    5: { name: "Ranger", description: "Precision Striker (Speed & High Criticals)" },
    6: { name: "Artillerist", description: "Focused Heavy Firepower (Frail Vanguard)" }
};


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
        //Flip a Coin en2
        document.getElementById("en2").style.display = "block";
    }

    if(comand == 5) {
        //rock paper scissors en1
        document.getElementById("en1").style.display = "block";
        Core_Encounter_RPS(0);
    }

    if(comand == 6) {
        //whack a mole ish en3
        document.getElementById("en3").style.display = "block";
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

var rps_player_score = 0;
var rps_demon_score = 0;
var rps_choices = ["Rock","Paper","Scissors"];
var rps_game_match = 3;

function Core_Encounter_RPS (comand) {
    if(comand == 0) {
        rps_player_score = 0;
        rps_demon_score = 0;
    }

}

var fac_player_score = 0;
var fac_demon_score = 0;
var fac_choices = ["Heads","Tails"];
var fac_game_match = 3;

function Core_Encounter_FAC (comand) {

}