var room_number = 0;
var floor_number = 1;
var floor_tally = 0;
var rooms_en = ["Merchant","BS","RPS","FAC","WAM","BS","PLGDR","HP","TR","BS"];

var room_entrd = [":",":",":",":",":",":",":"];

var dr_sc_opt = ["You see a door, we should break it down...","BREAK THE DOOR DOWN!","I bet ya a gold you cant break that door down...","Maybe we should knock on that door?"];
var dr_sc_end = ["Welp, we broke it","I TOLD YOU TO KNOCK NICELY!","QUICK ROB THE PLACE!","FBI OPEN UP!","Stealth is optional at this point..."]
var door_hp = 0;

function Core_Door_Randomizer(fun) {
    
    document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;

    if(fun == 0) {
        if(floor_tally <= 5) {
            room_number += 1;
            floor_tally += 1;
            document.getElementById("room_floor_tracker").innerHTML = "Floor " + floor_number + "-" + room_number;
            door_hp = Math.floor(Math.random() * 25) + 1;
            document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;
            document.getElementById("dr_actual_door").innerHTML = ":";
            document.getElementById("room_id").innerHTML = "Door " + room_number;
            document.getElementById("dr_actual_door").disabled = false;
            var door_scc = Math.floor(Math.random() * dr_sc_opt.length);
            document.getElementById("dr_sc").innerHTML = dr_sc_opt[door_scc];

            for (let i = 1; i < room_entrd.length; i++) {
                document.getElementById(`room_${i}_id`).innerHTML = room_entrd[i];
            }
        } else if (floor_tally == 6) {
            floor_tally = 0;
            room_number = 0;
            floor_number += 1;
            Engine_Hud(17);

            //pick a new theme...

            var themes = ["rock","forest","snow","desert","mushroom","lava"];

            var tm_sel = Math.floor(Math.random() * themes.length);

            if(tm_sel == 0) {
                Core_Env_Updater('rock', false);
            }

            if(tm_sel == 1) {
                Core_Env_Updater('forest', false);
            }

            if(tm_sel == 2) {
                Core_Env_Updater('snow', false);
            }

            if(tm_sel == 3) {
                Core_Env_Updater('desert', false);
            }

            if(tm_sel == 4) {
                Core_Env_Updater('mushroom', false);
            }

            if(tm_sel == 5) {
                Core_Env_Updater('lava', false);
            }
        }
    }

    if(fun == 1) {
        const button = document.getElementById('dr_actual_door');

        button.addEventListener('click', () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(100);
            } else {
            console.log("Vibration API is not supported on this device/browser.");
            }
        });
        if(door_hp >= 1) {
            door_hp -= 1;
            document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;
        }

        if(door_hp <= 0) {
            room_entrd[room_number] = "K";
            door_hp = 0;
            var door_scc = Math.floor(Math.random() * dr_sc_end.length);
            document.getElementById("dr_sc").innerHTML = dr_sc_end[door_scc];
            document.getElementById("dr_hp").innerHTML = "Hp: " + door_hp;
            document.getElementById("dr_actual_door").innerHTML = "K";
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
    var en_plg_dr_interval = null;
    var encounter_outcome = 0;

    function Core_Encounter_PLG_DR(comand) {
      if(comand == 0) {
        clearInterval(en_plg_dr_interval);
        en_plg_dr_plug_health = Math.floor(Math.random() * 50) + 1;
        en_plg_dr_water_lvl = 12;
        
        document.getElementById("c_en_plg_dr_oc").innerHTML = "Water starts filling the room. Unclog the drain quickly!";
        document.getElementById("en_plgdr_end").style.display = "none";
        document.getElementById("en_plgdr_board").style.display = "block";
        
        en_plg_dr_interval = setInterval(Core_Encounter_DRN_Prog, 600);
        Update_Water_UI();
      }

      if(comand == 1) {
        document.getElementById("c_en_plg_dr_oc").innerHTML = "The water has filled the room. Your body floats around like a fish...";
        document.getElementById("en_plgdr_end").style.display = "block";
        document.getElementById("en_plgdr_board").style.display = "none";
        clearInterval(en_plg_dr_interval);
        encounter_outcome = 0;
      }

      if(comand == 2) {
        document.getElementById("c_en_plg_dr_oc").innerHTML = "You unclogged the drain and successfully drained out the water!";
        document.getElementById("en_plgdr_end").style.display = "block";
        document.getElementById("en_plgdr_board").style.display = "none";
        clearInterval(en_plg_dr_interval);
        encounter_outcome = 2;
        
        en_plg_dr_water_lvl = 0;
        Update_Water_UI();
      }

      if(comand == 3) {
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

      Update_Water_UI();
    }

    function Update_Water_UI() {
      document.getElementById("pg_en_plgdr").value = en_plg_dr_water_lvl;
      document.getElementById("water_container").style.height = en_plg_dr_water_lvl + "%";
    }