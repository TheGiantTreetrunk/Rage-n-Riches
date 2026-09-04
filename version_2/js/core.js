var is_dev = 1;
var door_hp = 0;
var rb_core_score = 0;

var dr_sc_opt = ["You see a door, we should break it down...","BREAK THE DOOR DOWN!","I bet ya a gold you cant break that door down...","Maybe we should knock on that door?"];
var dr_sc_end = ["Welp, we broke it","I TOLD YOU TO KNOCK NICELY!","QUICK ROB THE PLACE!","FBI OPEN UP!","Stealth is optional at this point..."]

var enemy_nme = ["Ghost","Glarb","Serpant","Golem","Skeleton","Toad","Blob","Ember","Goblin"];
var enemy_hth = [3,4,3,8,4,2,2,2,4];
var enemy_dmg = [3,4,4,6,3,2,4,4,3];
var enemy_arm = [1,2,2,3,1,1,2,1,2];
var enemy_spd = [1500,1500,1000,3000,1500,1500,2500,3000,1500];
var enemy_icn = ["&","?","!",".",",","+",";","=","\x5C"];
var enemy_clr = ["white","green","lime","gray","white","olive","purple","orange","green"];

var enemy = {
    id: 0,
    name: "",
    health: 0,
    armor: 0,
    dmg: 0,
};

var unlockedClasses = [
    true, true, false, false, false, false, false
];

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

var player = {
    class: 0,
	lvl: 1,
    hp: 40,  
    dmg: 20,   
    arm: 10,
    thp: 10,
    spd_mlt: 1,
	inv: {
        gold: 0,
		pot_lvl: 0,
		pot_health: 0,
		pot_poison: 0,
		pot_armor: 0,
		pot_damage: 0,
        pot_speed: 0,
        food: 3,
        water: 3
	}
};


function Start() {

    if (localStorage.getItem('score') === null) {
        localStorage.setItem('score', '0');
    }

    let score = parseInt(localStorage.getItem('score'), 10);
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
    document.getElementById("en8").style.display = "none";
    document.getElementById("enout").style.display = "none";
    document.getElementById("ad").style.display = "none";
    document.getElementById("eg").style.display = "none";
    document.getElementById("sc_story_line").style.display = "none";

    document.getElementById("sc_dr_inv").style.display = "none";
    document.getElementById("sc_dr_sts").style.display = "none";
    document.getElementById("sc_dr_stry").style.display = "none";

    document.getElementById("rst_pnt").style.display = "none";


    document.getElementById("stars").style.display = "none";
    document.getElementById("stars2").style.display = "none";
    document.getElementById("stars3").style.display = "none";

    if(comand == 0) {
        //load splash screen
        //setTimeout(toggleFade, 2000);
        setTimeout(function(){ document.getElementById("ss").style.display = "block" }, 1500);
        setTimeout(function(){ document.getElementById("ss").style.display = "none" }, 3500);
        
        setTimeout(function(){ document.getElementById("mm").style.display = "block" }, 4500);
        //document.getElementById("ss").style.display = "block";
        //document.body.classList.remove('body_class_main_menu');
        document.body.classList.add('body_class_main_menu');
    }

    if(comand == 1) {
        //load class select
        room_number = 0;
        document.getElementById("cs").style.display = "block";
        document.getElementById("stars").style.display = "";
        document.getElementById("stars2").style.display = "";
        document.getElementById("stars3").style.display = "";
        if(is_dev == 0) {
		    renderClassTable();
        } else {
            cheatUnlockAll();
        }
    }

    if(comand == 2) {
        //load dungeon
        if(player.class != 0) {
            document.getElementById("cl_h_tit").innerHTML = "Loading...";
            document.getElementById("cl_p_diag").innerHTML = "Creating your adventure";
            document.getElementById("cl_st_bttn").style.display = "none";
            document.getElementById("cl").style.display = "block";
            setTimeout(function(){ document.getElementById("cl_h_tit").innerHTML = "Ready To Embark" }, 4500);
            setTimeout(function(){ document.getElementById("cl_p_diag").innerHTML = "Your adventure awaits!" }, 4500);
            setTimeout(function(){ document.getElementById("cl_st_bttn").style.display = "block" }, 4500);
            setTimeout(function(){ triggerNextCard() }, 500);
        } else {
            Engine_Hud(1);
            triggerNextCard();
        }
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
        Core_Encounter_HP(0);
    }

    if(comand == 10) {
        //plugged TRAPPED ROOM
        document.getElementById("en7").style.display = "block";
    }

    if(comand == 11) {
        document.getElementById("bs").style.display = "block";
        Core_Engine_Combat(0);
    }

    if(comand == 12) {
        document.getElementById("enout").style.display = "block";
        Core_Loot_Randomizer();
    }

    if(comand == 13) {
        document.getElementById("eg").style.display = "block";
        Core_Engine_Game_Over(0);
    }

    if(comand == 14) {
        document.getElementById("sc_dr_inv").style.display = "block";
    }

    if(comand == 15) {
        document.getElementById("sc_dr_sts").style.display = "block";
    }

    if(comand == 16) {
        document.getElementById("sc_dr_stry").style.display = "block";
        render();
    }
}
var room_number = 0;
var rooms_en = ["Merchant","BS","RPS","FAC","WAM","BS","PLGDR","HP","TR","BS"];

function Core_Door_Randomizer(fun) {
    
    document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;

    if(fun == 0) {
        room_number += 1;
        door_hp = Math.floor(Math.random() * 25) + 1;
        document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;
        document.getElementById("dr_actual_door").innerHTML = ":";
        document.getElementById("room_id").innerHTML = "Door " + room_number;
        document.getElementById("dr_actual_door").disabled = false;
        var door_scc = Math.floor(Math.random() * dr_sc_opt.length);
        document.getElementById("dr_sc").innerHTML = dr_sc_opt[door_scc];
    }

    if(fun == 1) {
        const button = document.getElementById('dr_actual_door');

        button.addEventListener('click', () => {
    // 1. Check if the browser & hardware support the Vibration API
        if ('vibrate' in navigator) {
            navigator.vibrate(100);

            // OR trigger a pattern: [Vibrate, Pause, Vibrate]
            // navigator.vibrate([200, 100, 200]);

            } else {
            //alert("Vibration API is not supported on this device/browser.");
            console.log("Vibration API is not supported on this device/browser.");
            }
        });
        if(door_hp >= 1) {
            door_hp -= 1;
            document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;
        }

        if(door_hp <= 0) {
            door_hp = 0;
            var door_scc = Math.floor(Math.random() * dr_sc_end.length);
            document.getElementById("dr_sc").innerHTML = dr_sc_end[door_scc];
            document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;
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

function renderClassTable() {
	document.getElementById("class_selection_container").innerHTML = "";
	
    let tableHtml = '<table style="margin: auto; text-align: center;"><tr>';
    let cols = 4;

    for (let i = 1; i < 7; i++) {
        if (i > 0 && i % cols === 0) {
            tableHtml += '</tr><tr>';
        }

        if (unlockedClasses[i]) {
            let color = class_colors[i];
            tableHtml += `<td><button data-class-num="${i}" class="class_select" onclick="class_selection(${i}, this)"><a class="icns ${color}">@</a></button></td>`;
        } else {
            tableHtml += `<td><button class="class_select locked" disabled><a class="icns dark_gray">@</a></button></td>`;
        }
    }

    tableHtml += '</tr></table>';
    document.getElementById("class_selection_container").innerHTML = tableHtml;
}

function unlockNextClass() {
    for (let i = 0; i < unlockedClasses.length; i++) {
        if (unlockedClasses[i] === false) {
            unlockedClasses[i] = true;
            console.log("New Class Unlocked: " + classes[i]);
            break;
        }
    }
}

function cheatUnlockAll() {
    unlockedClasses = new Array(30).fill(true);
    renderClassTable();
}

function class_selection(class_num, button_element) {

    /*
    var player = {
    class: 0,
	lvl: 1,
    hp: 40,  
    dmg: 20,   
    arm: 10,
    thp: 10,
    spd_mlt: 1,
	inv: {
        gold: 0,
		pot_lvl: 0,
		pot_health: 0,
		pot_poison: 0,
		pot_armor: 0,
		pot_damage: 0,
        pot_speed: 0,
        food: 3,
        water: 3
	}
};
 */
    
    var buttons = document.querySelectorAll('.class_select');
    buttons.forEach(function(button) {
        button.classList.remove('selected');
    });
    button_element.classList.add('selected');

    
    player.class = class_num;
    player.hp = class_health[class_num];
    player.dmg = class_damage[class_num];
    player.thp = class_armor[class_num];
    player.arm = class_armor[class_num];
    player.spd_mlt = 1.0; 
    player.lvl = 1;


    if (class_data[class_num]) {
        var selected_class = class_data[class_num];
        var selectedColorClass = class_colors[class_num]; 

        document.getElementById("name_of_class").innerHTML = selected_class.name.toUpperCase();
        document.getElementById("class_description").innerHTML = selected_class.description;
        
        document.getElementById("class_icon").innerHTML = `<a class='icns ${selectedColorClass}'>@</a>`;
        
        let gearInfo = `<br><span style='font-size:10px; color:#888;'>WEAPON: ${class_unique_weapon[class_num]}<br>
                        ARMOR: ${class_unique_armor[class_num]}</span>`;

        document.getElementById("class_stats").innerHTML = `
            <a class='red icns'>~</a> ${class_health[class_num]} 
            <a class='yellow icns'>$</a> ${class_damage[class_num]} 
            <a class='purple icns'>%</a> ${class_armor[class_num]}
            ${gearInfo}`;

        document.getElementById("name_of_class1").innerHTML = selected_class.name.toUpperCase();
        document.getElementById("class_icon1").innerHTML = `<a class='icns ${selectedColorClass}'>@</a>`;
        document.getElementById("class_level").innerHTML = "Level " + player.lvl;
        document.getElementById("class_stats1").innerHTML = `
            <a class='red icns'>~</a> ${class_health[class_num]} 
            <a class='yellow icns'>$</a> ${class_damage[class_num]} 
            <a class='purple icns'>%</a> ${class_armor[class_num]}
            ${gearInfo}`;
    }
}

function updatePlayerStats() {
    var classIndex = player.class;
    var level = player.lvl;

    if (level < 1) level = 1;
    if (level > 3) level = 3;

    var baseHp  = class_health[classIndex];
    var baseDmg = class_damage[classIndex];
    var baseArm = class_armor[classIndex];

    if (level === 1) {
        player.hp  = baseHp;
        player.dmg = baseDmg;
        player.arm = baseArm;
    } 
    else if (level === 2) {
        player.hp  = Math.ceil(baseHp * 1.5);
        player.dmg = Math.ceil(baseDmg * 1.5);
        player.arm = Math.ceil(baseArm * 1.5);
    } 
    else if (level === 3) {
        player.hp  = baseHp * 2;
        player.dmg = baseDmg * 2;
        player.arm = baseArm * 2;
    }
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
        encounter_outcome = 2;
    }
    if(rps_demon_score >= rps_game_match) {
        //alert("Demon wins!");
        document.getElementById("c_en_rps_oc").innerHTML = "The demon snickers at his win over you!";
        document.getElementById("rps_options").style.display = "none";
        document.getElementById("rps_end_of").style.display = "block";
        encounter_outcome = 0;
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
        document.getElementById("c_en_fac_oc").innerHTML = "The Ghost looks at you for your answer...";
        
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
        encounter_outcome = 2;
    }
    if(fac_demon_score >= rps_game_match) {
        //alert("Demon wins!");
        document.getElementById("c_en_fac_oc").innerHTML = "The ghost snickers at his win over you!";
        document.getElementById("en_fac_op").style.display = "none";
        document.getElementById("en_fac_end_of").style.display = "block";
        encounter_outcome = 0;
    }
}

var en_hp_choices = ["Death","Fight","Nothing","+2 Health","+5 Health","+10 Health"];

function Core_Encounter_HP(comand) {
    if(comand == 0) {
        document.getElementById("c_en_hp_oc").innerHTML = "You have discovered a healing pool!";
        document.getElementById("en_hp_op").style.display = "";
        document.getElementById("en_hp_end").style.display = "none";
    }

    if(comand == 1) {
        hp_choice = Math.floor(Math.random() * en_hp_choices.length);
        const diceDisplay = document.getElementById('en_hp_dice');
        const unicodePoint = 0x267F + hp_choice;

        diceDisplay.textContent = String.fromCodePoint(unicodePoint);

        if(hp_choice == 0) {
            //death
            document.getElementById("c_en_hp_oc").innerHTML = "You enter the pool to only discover its acid...";
            encounter_outcome = 0;
        }

        if(hp_choice == 1) {
            //Fight
            document.getElementById("c_en_hp_oc").innerHTML = "You enter the pool and are attacked!";
            encounter_outcome = 0;
        }

        if(hp_choice == 2) {
            //nothing
            document.getElementById("c_en_hp_oc").innerHTML = "You enter the pool and feel no effects!";
            encounter_outcome = 1;
        }

        if(hp_choice == 3) {
            //2 health
            document.getElementById("c_en_hp_oc").innerHTML = "You enter the pool and gain 2 health!";
            encounter_outcome = 2;
        }

        if(hp_choice == 4) {
            //2 health
            document.getElementById("c_en_hp_oc").innerHTML = "You enter the pool and gain 5 health!";
            encounter_outcome = 2;
        }

        if(hp_choice == 5) {
            //2 health
            document.getElementById("c_en_hp_oc").innerHTML = "You enter the pool and gain 10 health!";
            encounter_outcome = 2;
        }

        document.getElementById("en_hp_op").style.display = "none";
        document.getElementById("en_hp_end").style.display = "block";
    }

    if(comand == 2) {
        document.getElementById("c_en_hp_oc").innerHTML = "You decided its not worth the risk...";
        document.getElementById("en_hp_op").style.display = "none";
        document.getElementById("en_hp_end").style.display = "block";
        encounter_outcome = 1;
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
            encounter_outcome = 0;
        }

        if(tr_bp_choice == 1) {
            //-4 health
            document.getElementById("c_en_tr_oc").innerHTML = "You triggered the trap and lost 4 Health!";
            encounter_outcome = 1;
        }

        if(tr_bp_choice == 2) {
            //-4 health
            document.getElementById("c_en_tr_oc").innerHTML = "You triggered the trap and lost 2 Health!";
            encounter_outcome = 1;
        }

        if(tr_bp_choice == 3) {
            //nothing
            document.getElementById("c_en_tr_oc").innerHTML = "You disabled the trap!";
            encounter_outcome = 2;
        }

        if(tr_bp_choice == 4) {
            //nothing
            document.getElementById("c_en_tr_oc").innerHTML = "You disabled the trap!";
            encounter_outcome = 2;
        }

        if(tr_bp_choice == 5) {
            //nothing
            document.getElementById("c_en_tr_oc").innerHTML = "You disabled the trap!";
            encounter_outcome = 2;
        }

        document.getElementById("en_tr_op").style.display = "none";
        document.getElementById("en_tr_end").style.display = "block";
    }

    if(comand == 2) {
        tr_bp_choice = Math.floor(Math.random() * en_tr_choices_bypass.length);

        if(tr_bp_choice == 0) {
            //-4 health
            document.getElementById("c_en_tr_oc").innerHTML = "You bypassed the trap but triggered it and lost 4 health!";
            encounter_outcome = 1;
        }

        if(tr_bp_choice == 1) {
            //-2 health
            document.getElementById("c_en_tr_oc").innerHTML = "You bypassed the trap but triggered it and lost 2 health!";
            encounter_outcome = 1;
        }

        if(tr_bp_choice == 2) {
            //nothing
            document.getElementById("c_en_tr_oc").innerHTML = "You bypassed the trap!";
            encounter_outcome = 2;
        }

        if(tr_bp_choice == 3) {
            //nothing
            document.getElementById("c_en_tr_oc").innerHTML = "You bypassed the trap!";
            encounter_outcome = 2;
        }

        if(tr_bp_choice == 4) {
            //nothing
            document.getElementById("c_en_tr_oc").innerHTML = "You bypassed the trap!"; 
            encounter_outcome = 2;
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
        encounter_outcome = 0;
    }

    if(comand == 2) {
        //clear out player won
        document.getElementById("c_en_wam_oc").innerHTML = "The goblin grovels in pain and gives you the key.";
        clearInterval(en_wam_interval_good);
        clearInterval(en_wam_interval_bad);
        clearTimeout(en_wam_timeout);
        document.getElementById("en_wam_board").style.display = "none";
        document.getElementById("en_wam_end").style.display = "block";
        encounter_outcome = 2;
    }
}

function Core_Encounter_WAM_Gd() {
    //clear board
    var wam_good_spot = Math.floor(Math.random() * wam_map.length);
    
    for (let i = 0; i < wam_map.length; i++) {
        if(i == wam_spot_gd) {
            document.getElementById(`wam_${wam_spot_gd}`).innerHTML = "_";
            document.getElementById(`wam_${wam_spot_gd}`).classList.remove("green");
        }
    }

    wam_spot_gd = wam_good_spot;
    document.getElementById(`wam_${wam_spot_gd}`).innerHTML = "\x5C";
    document.getElementById(`wam_${wam_spot_gd}`).classList.add("green");
}

function Core_Encounter_WAM_Bd() {
    //clear board
    var wam_bad_spot = Math.floor(Math.random() * wam_map.length);
    
    for (let i = 0; i < wam_map.length; i++) {
        if(i == wam_spot_bd) {
            document.getElementById(`wam_${wam_spot_bd}`).innerHTML = "_";
            document.getElementById(`wam_${wam_spot_bd}`).classList.remove("red");
        }
    }

    wam_spot_bd = wam_bad_spot;
    document.getElementById(`wam_${wam_spot_bd}`).innerHTML = "X";
    document.getElementById(`wam_${wam_spot_bd}`).classList.add("red");
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
        encounter_outcome = 0;
    }

    if(comand == 2) {
        document.getElementById("c_en_plg_dr_oc").innerHTML = "You unclogged the drain and succesfully drained out the water of the room!";
        document.getElementById("en_plgdr_end").style.display = "block";
        document.getElementById("en_plgdr_board").style.display = "none";
        clearInterval(en_plg_dr_interval);
        encounter_outcome = 2;
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

function Core_Encounter_MERCHANT(comand) {}

function Core_Encounter_BS(comand) {}

var loot_pool = ["Gold","Gold","Health Potion","Food","Gold","Strength Potion","Gold","Food","Armor Potion","Food","Gold","Power Potion","Gold","Gold"];
var loot_box_1 = 0;
var loot_box_1_amount = 0;
var loot_box_2 = 0;
var loot_box_2_amount = 0;
var loot_box_3 = 0;
var loot_box_3_amount = 0;


function Core_Loot_Randomizer() {
    //encounter_outcome
    if(encounter_outcome == 0) {
        document.getElementById("loot_selection").style.display = "none";
        document.getElementById("end_of_end").style.display = "";

        document.getElementById("loot_oc_end").innerHTML = "You just make it past the encounter...";
        document.getElementById("loot_comment").innerHTML = "+15 points";
    }

    if(encounter_outcome == 1) {
        document.getElementById("loot_selection").style.display = "";
        document.getElementById("end_of_end").style.display = "none";
        document.getElementById("loot_oc_end").innerHTML = "You made it past the encounter but with little loot...";
        //just won barely so one loot box
        loot_box_1 = Math.floor(Math.random() * loot_pool.length);
        loot_box_1_amount = Math.floor(Math.random() * 5) + 1;
        document.getElementById("chest_1").style.display = ""; 
        document.getElementById("chest_2").style.display = "none";
        document.getElementById("chest_3").style.display = "none";
    }

    if(encounter_outcome == 2) {
        //won so two loot boxes
        document.getElementById("loot_selection").style.display = "";
        document.getElementById("end_of_end").style.display = "none";
        document.getElementById("loot_oc_end").innerHTML = "You made it past the encounter with moderate loot...";
        loot_box_1 = Math.floor(Math.random() * loot_pool.length);
        loot_box_1_amount = Math.floor(Math.random() * 5) + 1;
        loot_box_2 = Math.floor(Math.random() * loot_pool.length);
        loot_box_2_amount = Math.floor(Math.random() * 5) + 1;
        document.getElementById("chest_1").style.display = "";
        document.getElementById("chest_2").style.display = "";
        document.getElementById("chest_3").style.display = "none";
    }

    if(encounter_outcome == 3) {    
        //won a battle against an enemy three loot boxes
        document.getElementById("loot_selection").style.display = "";
        document.getElementById("end_of_end").style.display = "none";
        document.getElementById("loot_oc_end").innerHTML = "You made it past the encounter with substantial loot...";
        loot_box_1 = Math.floor(Math.random() * loot_pool.length);
        loot_box_1_amount = Math.floor(Math.random() * 5) + 1;
        loot_box_2 = Math.floor(Math.random() * loot_pool.length);
        loot_box_2_amount = Math.floor(Math.random() * 5) + 1;
        loot_box_3 = Math.floor(Math.random() * loot_pool.length);
        loot_box_3_amount = Math.floor(Math.random() * 5) + 1;
        document.getElementById("chest_1").style.display = "";
        document.getElementById("chest_2").style.display = "";
        document.getElementById("chest_3").style.display = "";
    }

    if(encounter_outcome == 4) {
        document.getElementById("loot_selection").style.display = "none";
        document.getElementById("end_of_end").style.display = "";
    }

    if(encounter_outcome == 5) {
        //player death!
        Engine_Hud(13);
    }
}

function Core_Encounter_Loot_Callout(chest) {
    if(chest == 1) {

    }
    if(chest == 2) {

    }
    if(chest == 3) {

    }
}


var isincombat = 0;

function Core_Engine_Combat(comand) {
    if(comand == 0) {

        for (let i = 0; i < enemy_clr.length; i++) {
            document.getElementById("enemy_battle_icon").classList.remove(enemy_clr[i]);
        }

        document.getElementById("en_bs_end_of").style.display = "none";
        document.getElementById("combat_books").style.display = "";
        isincombat = 1;

        var enmy = Math.floor(Math.random() * enemy_nme.length);
        enemy.id = enmy;
        enemy.name = enemy_nme[enmy];
        enemy.health = enemy_hth[enmy];
        enemy.armor = enemy_arm[enmy];
        enemy.dmg = enemy_dmg[enmy];
        document.getElementById("enemy_battle_icon").classList.add(enemy_clr[enmy]);
        document.getElementById("enemy_battle_icon").innerHTML = enemy_icn[enmy];
        document.getElementById("enemy_battle_health").innerHTML= enemy.health;
        document.getElementById("enemy_battle_armor").innerHTML = enemy.armor;

        document.getElementById("en_bs_sc").innerHTML = "You come across a " + enemy.name + " they look mad...";
        Core_Enemy_Speed_Adjust(enemy_spd[enmy]);
    }

    if(comand == 1) {
        document.getElementById("player_battle_health").innerHTML = player.hp;
        document.getElementById("player_battle_armor").innerHTML = player.thp;
        document.getElementById("enemy_battle_health").innerHTML= enemy.health;
        document.getElementById("enemy_battle_armor").innerHTML = enemy.armor;

        if(player.hp <= 0) {
            player.hp = 0;
            isincombat = 0;
            document.getElementById("player_battle_health").innerHTML = player.hp;
            document.getElementById("player_battle_armor").innerHTML = player.armor;
            document.getElementById("en_bs_end_of").style.display = "";
            document.getElementById("combat_books").style.display = "none";
            document.getElementById("en_bs_sc").innerHTML = "You have been defeated by the " + enemy.name + "...";
            encounter_outcome = 5;

            document.getElementById("en_bs_end_of").style.display = "";
            document.getElementById("combat_books").style.display = "none";
        }
    }
}

let delay = 2000;
let intervalId;

function Core_Enemy_Damage() {
    if(isincombat == 1) {
        console.log("Hello world!");
        var dablage = Math.floor(Math.random() * enemy.dmg) + 1;
        player.hp -= dablage;
        Core_Engine_Combat(1);
    }
}

function Core_Enemy_Interval() {
    clearInterval(intervalId); 
    intervalId = setInterval(Core_Enemy_Damage, delay); 
}

function Core_Enemy_Speed_Adjust(newDelay) {
    delay = newDelay;
    Core_Enemy_Interval();
}

function Core_Engine_Game_Over(comand) {
    if(comand == 0) {
        document.getElementById("eg").style.display = "block";
        document.getElementById("eg_sc").innerHTML = "You have died in the dungeon...";
    }
}

const board = document.getElementById('chapel-display');
    const symbols = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍍', '🥝', '🍉'];
    let cards = [...symbols, ...symbols];
    let flippedCards = [];
    let matchedCount = 0;
    let lockBoard = false;

    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function createCard(symbol) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-face card-front">?</div>
            <div class="card-face card-back">${symbol}</div>
        `;
        card.addEventListener('click', flipCard);
        return card;
    }

    function flipCard() {
        if (lockBoard || this.classList.contains('flipped')) return;

        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }

    function checkMatch() {
        lockBoard = true;
        const [card1, card2] = flippedCards;
            
            // Match logic based on text symbol inside the card
        const symbol1 = card1.querySelector('.card-back').textContent;
        const symbol2 = card2.querySelector('.card-back').textContent;

        if (symbol1 === symbol2) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            resetTurn();
            matchedCount += 2;
            if (matchedCount === cards.length) setTimeout(() => alert('You Won!'), 500);
        } else {
            setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            resetTurn();
        }, 1000);
    }
}

function resetTurn() {
    flippedCards = [];
    lockBoard = false;
}

function initGame() {
    board.innerHTML = '';
    matchedCount = 0;
    const shuffledCards = shuffle(cards);
    shuffledCards.forEach(symbol => {
        board.appendChild(createCard(symbol));
    });
}

        //initGame();