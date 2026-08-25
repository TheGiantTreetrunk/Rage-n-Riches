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
    document.getElementById("en4").style.display = "none";
    document.getElementById("en5").style.display = "none";
    document.getElementById("en6").style.display = "none";
    document.getElementById("en7").style.display = "none";
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
        room_number = 0;
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
        Core_Encounter_WAM(0);
    }

    if(comand == 7) {
        //plugged drain en4
        document.getElementById("en4").style.display = "block";
        Core_Encounter_PLG_DR(0);
    }

    if(comand == 8) {
        //plugged MERCHANT
        document.getElementById("en5").style.display = "block";
    }

    if(comand == 9) {
        //plugged HEALING POOL
        document.getElementById("en6").style.display = "block";
    }

    if(comand == 10) {
        //plugged TRAPPED ROOM
        document.getElementById("en7").style.display = "block";
    }

    if(comand == 11) {
        document.getElementById("bs").style.display = "block";
    }

    if(comand == 12) {
        document.getElementById("enout").style.display = "block";
    }

    if(comand == 13) {
        document.getElementById("eg").style.display = "block";
    }
}
var room_number = 0;
var rooms_en = ["Merchant","BS","RPS","FAC","WAM","BS","PLGDR","HP","TR","BS"];

function Core_Door_Randomizer(fun) {
    
    document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;

    if(fun == 0) {
        room_number += 1;
        door_hp = Math.floor(Math.random() * 10) + 1;
        document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;
        document.getElementById("dr_actual_door").innerHTML = ":";
        document.getElementById("room_id").innerHTML = "Door " + room_number;
        document.getElementById("dr_actual_door").disabled = false;
    }

    if(fun == 1) {
        if(door_hp >= 1) {
            door_hp -= 1;
            document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;
        }

        if(door_hp <= 0) {
            door_hp = 0;
            document.getElementById("dr_hp").innerHTML = "You break down the door!";
            document.getElementById("dr_actual_door").innerHTML = "X";
            document.getElementById("dr_actual_door").disabled = true;
            //alert("opening door!");
            var room_selection_ran = Math.floor(Math.random() * rooms_en.length);

            if(rooms_en[room_selection_ran] == "Merchant") {
                setTimeout(function(){Engine_Hud(8)}, 1500);
                
            }

            if(rooms_en[room_selection_ran] == "BS") {
                setTimeout(function(){Engine_Hud(11)}, 1500);
                
            }

            if(rooms_en[room_selection_ran] == "RPS") {
                setTimeout(function(){Engine_Hud(5)}, 1500);
                
            }

            if(rooms_en[room_selection_ran] == "FAC") {
                setTimeout(function(){Engine_Hud(4)}, 1500);
                
            }

            if(rooms_en[room_selection_ran] == "WAM") {
                setTimeout(function(){Engine_Hud(6)}, 1500);
                
            }

            if(rooms_en[room_selection_ran] == "PLGDR") {
                setTimeout(function(){Engine_Hud(7)}, 1500);
                
            }

            if(rooms_en[room_selection_ran] == "HP") {
                setTimeout(function(){Engine_Hud(9)}, 1500);
                
            }

            if(rooms_en[room_selection_ran] == "TR") {
                setTimeout(function(){Engine_Hud(10)}, 1500);
                
            }
        }
    }
}

function Core_World_Generator () {
    
}


//encounters
var encounter_outcome = 0;
//1 loss
//2 win

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

var en_hp_choices = ["Death","Fight","Nothing","+2 Health","+5 Health","+10 Health"];

function Core_Encounter_HP(comand) {
    if(comand == 0) {
        document.getElementById("c_en_fac_oc").innerHTML = "You have discovered a healing pool!";
        document.getElementById("en_hp_op").style.display = "block";
        document.getElementById("en_hp_end").style.display = "none";
    }

    if(comand == 1) {
        hp_choice = Math.floor(Math.random() * en_hp_choices.length);

        if(hp_choice == 0) {
            //death
            document.getElementById("c_en_fac_oc").innerHTML = "You enter the pool to only discover its acid...";
        }

        if(hp_choice == 1) {
            //Fight
            document.getElementById("c_en_fac_oc").innerHTML = "You enter the pool and are attacked!";
        }

        if(hp_choice == 2) {
            //nothing
            document.getElementById("c_en_fac_oc").innerHTML = "You enter the pool and feel no effects!";
        }

        if(hp_choice == 3) {
            //2 health
            document.getElementById("c_en_fac_oc").innerHTML = "You enter the pool and gain 2 health!";
        }

        if(hp_choice == 4) {
            //2 health
            document.getElementById("c_en_fac_oc").innerHTML = "You enter the pool and gain 5 health!";
        }

        if(hp_choice == 5) {
            //2 health
            document.getElementById("c_en_fac_oc").innerHTML = "You enter the pool and gain 10 health!";
        }

        document.getElementById("en_hp_op").style.display = "none";
        document.getElementById("en_hp_end").style.display = "block";
    }

    if(comand == 2) {
        document.getElementById("c_en_fac_oc").innerHTML = "You decided its not worth the risk...";
        document.getElementById("en_hp_op").style.display = "none";
        document.getElementById("en_hp_end").style.display = "block";
    }
}

var en_tr_choices_disarm = ["Death","-4 Health","-2 Health","Nothing","Nothing","Nothing"];
var en_tr_choices_bypass = ["-4 Health","-2 Health","Nothing","Nothing","Nothing"];

function Core_Encounter_TR(comand) {
    if(comand == 0) {
        document.getElementById("c_en_tr_oc").innerHTML = "You have discovered a trap in this room.";
        document.getElementById("en_tr_op").style.display = "block";
        document.getElementById("en_tr_end").style.display = "none";
    }

    if(comand == 1) {
        tr_bp_choice = Math.floor(Math.random() * en_tr_choices_disarm.length);

        if(tr_bp_choice == 0) {
            //death
            document.getElementById("c_en_tr_oc").innerHTML = "You failed to disable the trap and died!";
        }

        if(tr_bp_choice == 1) {
            //-4 health
            document.getElementById("c_en_tr_oc").innerHTML = "You triggered the trap and lost 4 Health!";
        }

        if(tr_bp_choice == 2) {
            //-4 health
            document.getElementById("c_en_tr_oc").innerHTML = "You triggered the trap and lost 2 Health!";
        }

        if(tr_bp_choice == 3) {
            //nothing
            document.getElementById("c_en_tr_oc").innerHTML = "You disabled the trap!";
        }

        if(tr_bp_choice == 4) {
            //nothing
            document.getElementById("c_en_tr_oc").innerHTML = "You disabled the trap!";
        }

        if(tr_bp_choice == 5) {
            //nothing
            document.getElementById("c_en_tr_oc").innerHTML = "You disabled the trap!";
        }

        document.getElementById("en_tr_op").style.display = "none";
        document.getElementById("en_tr_end").style.display = "block";
    }

    if(comand == 2) {
        tr_bp_choice = Math.floor(Math.random() * en_tr_choices_bypass.length);

        if(tr_bp_choice == 0) {
            //-4 health
            document.getElementById("c_en_tr_oc").innerHTML = "You bypassed the trap but triggered it and lost 4 health!";
        }

        if(tr_bp_choice == 1) {
            //-2 health
            document.getElementById("c_en_tr_oc").innerHTML = "You bypassed the trap but triggered it and lost 2 health!";
        }

        if(tr_bp_choice == 2) {
            //nothing
            document.getElementById("c_en_tr_oc").innerHTML = "You bypassed the trap!";
        }

        if(tr_bp_choice == 3) {
            //nothing
            document.getElementById("c_en_tr_oc").innerHTML = "You bypassed the trap!";
        }

        if(tr_bp_choice == 4) {
            //nothing
            document.getElementById("c_en_tr_oc").innerHTML = "You bypassed the trap!";
        }

        document.getElementById("en_tr_op").style.display = "none";
        document.getElementById("en_tr_end").style.display = "block";
    }
}

var wam_score = 100;
var wam_score_quote = 10;
var wam_map = [0,0,0,0,0,0,0,0,0];
var wam_spot_gd = 0;
var wam_spot_bd = 0;

function Core_Encounter_WAM(comand) {
    var en_wam_timeout = 0;
    var en_wam_interval_good = 0;
    var en_wam_interval_bad = 0;
    if(comand == 0) {
        wam_score = 100;
        document.getElementById("c_en_wam_sc").innerHTML = wam_score + "<br> Goblin Health";
        document.getElementById("c_en_wam_oc").innerHTML = "Wack the Goblin to grab the key to the door!";
        en_wam_timeout = setTimeout(function() {Core_Encounter_WAM(1)}, 30000);
        en_wam_interval_good = setInterval(Core_Encounter_WAM_Gd, 1500);
        en_wam_interval_good = setInterval(Core_Encounter_WAM_Bd, 2500);
        document.getElementById("en_wam_end").style.display = "none";
        document.getElementById("en_wam_board").style.display = "block";
    }

    if(comand == 1) {
        //clear out player lost
        document.getElementById("c_en_wam_oc").innerHTML = "The Goblin is laughing at his trickery over you!";
        clearInterval(en_wam_interval_good);
        clearInterval(en_wam_interval_bad);
        clearTimeout(en_wam_timeout);
        document.getElementById("en_wam_board").style.display = "none";
        document.getElementById("en_wam_end").style.display = "block";
    }

    if(comand == 2) {
        //clear out player won
        document.getElementById("c_en_wam_oc").innerHTML = "The goblin grovels in pain and gives you the key.";
        clearInterval(en_wam_interval_good);
        clearInterval(en_wam_interval_bad);
        clearTimeout(en_wam_timeout);
        document.getElementById("en_wam_board").style.display = "none";
        document.getElementById("en_wam_end").style.display = "block";
    }
}

function Core_Encounter_WAM_Gd() {
    //clear board
    var wam_good_spot = Math.floor(Math.random() * wam_map.length);
    
    for (let i = 0; i < wam_map.length; i++) {
        if(i == wam_spot_gd) {
            document.getElementById(`wam_${wam_spot_gd}`).innerHTML = "_";
        }
    }

    wam_spot_gd = wam_good_spot;
    document.getElementById(`wam_${wam_spot_gd}`).innerHTML = "@";
}

function Core_Encounter_WAM_Bd() {
    //clear board
    var wam_bad_spot = Math.floor(Math.random() * wam_map.length);
    
    for (let i = 0; i < wam_map.length; i++) {
        if(i == wam_spot_bd) {
            document.getElementById(`wam_${wam_spot_bd}`).innerHTML = "_";
        }
    }

    wam_spot_bd = wam_bad_spot;
    document.getElementById(`wam_${wam_spot_bd}`).innerHTML = "X";
}

function en_wam_wack(comand) {
    if(comand == wam_spot_gd) {
        wam_score -= 20;
    }

    if(comand == wam_spot_bd) {
        wam_score += 10;
    }

    if(wam_score <= 0) {
        Core_Encounter_WAM(2);
    }
    document.getElementById("c_en_wam_sc").innerHTML = wam_score + "<br> Goblin Health";
}

var en_plg_dr_plug_health = 0;
var en_plg_dr_water_lvl = 0;
function Core_Encounter_PLG_DR(comand) {
    var en_plg_dr_interval = 12;
    if(comand == 0) {
        en_plg_dr_plug_health = Math.floor(Math.random() * 50) + 1;
        en_plg_dr_water_lvl = 12;
        document.getElementById("c_en_plg_dr_oc").innerHTML = "Water starts filling the room. Unclog the drain quickly!";
        en_plg_dr_interval = setInterval(Core_Encounter_DRN_Prog, 600);
        document.getElementById("en_plgdr_end").style.display = "none";
        document.getElementById("en_plgdr_board").style.display = "block";
    }

    if(comand == 1) {
        document.getElementById("c_en_plg_dr_oc").innerHTML = "The water has filled the room. Your body floats around like a fish...";
        document.getElementById("en_plgdr_end").style.display = "block";
        document.getElementById("en_plgdr_board").style.display = "none";
        clearInterval(en_plg_dr_interval);
    }

    if(comand == 2) {
        document.getElementById("c_en_plg_dr_oc").innerHTML = "You unclogged the drain and succesfully drained out the water of the room!";
        document.getElementById("en_plgdr_end").style.display = "block";
        document.getElementById("en_plgdr_board").style.display = "none";
        clearInterval(en_plg_dr_interval);
    }

    if(comand == 3) {
        //unclogg the drain!
        en_plg_dr_plug_health -= 1;

        if(en_plg_dr_plug_health <= 0) {
            Core_Encounter_PLG_DR(2);
        }
    }
}

function Core_Encounter_DRN_Prog() {
    en_plg_dr_water_lvl += 1;

    if(en_plg_dr_water_lvl >= 100) {
        Core_Encounter_PLG_DR(1);
    }

    if(en_plg_dr_water_lvl <= 0) {
        Core_Encounter_PLG_DR(2);
    }

    document.getElementById("pg_en_plgdr").value = en_plg_dr_water_lvl;
}