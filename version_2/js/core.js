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
    //document.getElementById("en1").style.display = "none";
    //document.getElementById("en2").style.display = "none";
    //document.getElementById("en3").style.display = "none";
    //document.getElementById("en4").style.display = "none";
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
        Core_Encounter_FAC(0);
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
        //plugged drain en4
        document.getElementById("en4").style.display = "block";
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
var rps_demon_choice = 0;
var rps_choices = ["Rock","Paper","Scissors"];
var rps_game_match = 3;

function Core_Encounter_RPS (comand) {
    if(comand == 0) {
        rps_player_score = 0;
        rps_demon_score = 0;
        document.getElementById("rps_options").style.display = "block";
        document.getElementById("rps_end_of").style.display = "none";
        document.getElementById("c_en_rps_oc").innerHTML = " ";
       
    }

    if(comand == 1) {
        //player picks rock 
        rps_demon_choice = Math.floor(Math.random() * rps_choices.length);
        if(rps_demon_choice == 0) {
            document.getElementById("c_en_rps_oc").innerHTML = "You both pick rock";
        }
        if(rps_demon_choice == 1) {
            document.getElementById("c_en_rps_oc").innerHTML = "You pick rock, the demon beat you with paper!";
            rps_demon_score += 1;
        }
        if(rps_demon_choice == 2) {
            document.getElementById("c_en_rps_oc").innerHTML = "You pick rock, the demons scissors is no match!";
            rps_player_score += 1;
        }
    }

    if(comand == 2) {
        //player picks paper 
        rps_demon_choice = Math.floor(Math.random() * rps_choices.length);
        if(rps_demon_choice == 0) {
            document.getElementById("c_en_rps_oc").innerHTML = "You pick paper, and cover the demons rock!";
            rps_player_score += 1;
        }
        if(rps_demon_choice == 1) {
            document.getElementById("c_en_rps_oc").innerHTML = "You both pick paper!";
        }
        if(rps_demon_choice == 2) {
            document.getElementById("c_en_rps_oc").innerHTML = "You pick paper, the demons scissors cuts up your paper!";
            rps_demon_score += 1;
        }
    }

    if(comand == 3) {
        //player picks scissors 
        rps_demon_choice = Math.floor(Math.random() * rps_choices.length);
        if(rps_demon_choice == 0) {
            document.getElementById("c_en_rps_oc").innerHTML = "You pick paper, and the demon crushed your scissors with a rock!";
            rps_demon_score += 1;
        }
        if(rps_demon_choice == 1) {
            document.getElementById("c_en_rps_oc").innerHTML = "You both pick Scissors, and chop up the demons paper!";
            rps_player_score += 1;
        }
        if(rps_demon_choice == 2) {
            document.getElementById("c_en_rps_oc").innerHTML = "You both pick Scissors!";
        }
    }
    
    document.getElementById("c_en_rps_sc").innerHTML = "Score <br>" + "You " + rps_player_score + " : " + rps_demon_score + " Demon";

    if(rps_player_score >= rps_game_match) {
        //alert("Player wins!");
        document.getElementById("c_en_rps_oc").innerHTML = "You beat the demon at their own game!";
        document.getElementById("rps_options").style.display = "none";
        document.getElementById("rps_end_of").style.display = "block";
    }
    if(rps_demon_score >= rps_game_match) {
        //alert("Demon wins!");
        document.getElementById("c_en_rps_oc").innerHTML = "The demon snickers at his win over you!";
        document.getElementById("rps_options").style.display = "none";
        document.getElementById("rps_end_of").style.display = "block";
    }

}

var fac_player_score = 0;
var fac_demon_score = 0;
var fac_demon_choice = 0;
var fac_choices = ["Heads","Tails"];
var fac_game_match = 3;

function Core_Encounter_FAC (comand) {
    if(comand == 0) {
        fac_demon_score = 0;
        fac_player_score = 0;
        document.getElementById("en_fac_op").style.display = "block";
        document.getElementById("en_fac_end_of").style.display = "none";
        document.getElementById("c_en_fac_oc").innerHTML = " ";
        
    }

    if(comand == 1) {
        fac_demon_choice = Math.floor(Math.random() * fac_choices.length);
        if(fac_demon_choice == 0) {
            document.getElementById("c_en_fac_oc").innerHTML = "You picked heads, and the ghost got heads!";
            fac_player_score += 1;
        }

        if(fac_demon_choice == 1) {
            document.getElementById("c_en_fac_oc").innerHTML = "You called heads but landed tails";
            fac_demon_score += 1;
        }
    }

    if(comand == 2) {
        fac_demon_choice = Math.floor(Math.random() * fac_choices.length);
        if(fac_demon_choice == 0) {
            document.getElementById("c_en_fac_oc").innerHTML = "You called tails but the ghost got heads!";
            fac_demon_score += 1;
        }

        if(fac_demon_choice == 1) {
            document.getElementById("c_en_fac_oc").innerHTML = "You called tails the ghost got tails!";
            fac_player_score += 1;
        }
    }

    document.getElementById("c_en_fac_sc").innerHTML = "Score <br>" + "You " + fac_player_score + " : " + fac_demon_score + "  Ghost";

    if(fac_player_score >= rps_game_match) {
        //alert("Player wins!");
        document.getElementById("c_en_fac_oc").innerHTML = "You beat the ghost at their own game!";
        document.getElementById("en_fac_op").style.display = "none";
        document.getElementById("en_fac_end_of").style.display = "block";
    }
    if(fac_demon_score >= rps_game_match) {
        //alert("Demon wins!");
        document.getElementById("c_en_fac_oc").innerHTML = "The ghost snickers at his win over you!";
        document.getElementById("en_fac_op").style.display = "none";
        document.getElementById("en_fac_end_of").style.display = "block";
    }
}

var en_hp_choices = ["Death","Nothing","Fight","+2 Health","+5 Health","+10 Health"];

function Core_Encounter_HP(comand) {
    if(comand == 0) {
        document.getElementById("c_en_fac_oc").innerHTML = "You have discovered a healing pool!";
    }

    if(comand == 1) {
        hp_choice = Math.floor(Math.random() * en_hp_choices.length);

        if(hp_choice == 0) {
            //death

        }
    }
}

var en_tr_choices = ["Death","-4 Health","-2 Health","Nothing","Nothing","Nothing"];

function Core_Encounter_TR(comand) {

}

var wam_time_limit = 60;
var wam_score_quote = 10;
var wam_map = [0,0,0,0,0,0,0,0,0];
var wam_spot_gd = 0;
var wam_spot_bd = 0;

function Core_Encounter_WAM(comand) {

}