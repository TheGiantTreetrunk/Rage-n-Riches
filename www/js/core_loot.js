var loot_pool = ["Gold","Gold","Health Potion","Food","Gold","Strength Potion","Gold","Food","Armor Potion","Food","Gold","Power Potion","Gold","Gold"];
var loot_box_1 = 0;
var loot_box_1_amount = 0;
var loot_box_2 = 0;
var loot_box_2_amount = 0;
var loot_box_3 = 0;
var loot_box_3_amount = 0;

var total_crates = 0;


function Core_Loot_Randomizer() {

    audioEngine.stop();
    audioEngine.play("challengeVictory");

    document.getElementById("chest_1").disabled = false;
    document.getElementById("chest_2").disabled = false;
    document.getElementById("chest_3").disabled = false;

    document.getElementById("chest_1").innerHTML = "(";
    document.getElementById("chest_2").innerHTML = "(";
    document.getElementById("chest_3").innerHTML = "(";

    //encounter_outcome
    if(encounter_outcome == 0) {
        document.getElementById("loot_selection").style.display = "none";
        document.getElementById("end_of_end").style.display = "";

        // Award baseline points for scraping by an encounter
        rb_core_score += 15;
        if (typeof Check_Player_Level_Up === 'function') { Check_Player_Level_Up(); }

        document.getElementById("loot_oc_end").innerHTML = "You just make it past the encounter...";
        document.getElementById("loot_comment").innerHTML = "+15 points";
    }

    if(encounter_outcome == 1) {
        total_crates = 1;
        rb_core_score += 25; // Points for clearing encounter
        if (typeof Check_Player_Level_Up === 'function') { Check_Player_Level_Up(); }

        document.getElementById("loot_selection").style.display = "";
        document.getElementById("end_of_end").style.display = "none";
        document.getElementById("loot_oc_end").innerHTML = "You made it past the encounter with little loot...";
        
        loot_box_1 = Math.floor(Math.random() * loot_pool.length);
        loot_box_1_amount = Math.floor(Math.random() * 5) + 1;
        document.getElementById("chest_1").style.display = ""; 
        document.getElementById("chest_2").style.display = "none";
        document.getElementById("chest_3").style.display = "none";
    }

    if(encounter_outcome == 2) {
        total_crates = 2;
        rb_core_score += 50; // Points for moderate win
        if (typeof Check_Player_Level_Up === 'function') { Check_Player_Level_Up(); }

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
        total_crates = 3;  
        rb_core_score += 100; // Major points for slaying an enemy/boss win
        if (typeof Check_Player_Level_Up === 'function') { Check_Player_Level_Up(); }

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

    if(encounter_outcome == 6) {
        rb_core_score += 1000; // Massive bonus for defeating the super boss
        if (typeof Check_Player_Level_Up === 'function') { Check_Player_Level_Up(); }
        Engine_Hud(22);
    }
}

function Core_Encounter_Loot_Callout(chest) {
    // Award bonus score points for opening chests (e.g., +20 score per chest opened)
    rb_core_score += 20;
    if (typeof Check_Player_Level_Up === 'function') { Check_Player_Level_Up(); }

    if(chest == 1) {
        if(loot_box_1_amount >= 2) {
            document.getElementById("loot_comment").innerHTML = "Chest #1 has " + loot_box_1_amount + " " + loot_pool[loot_box_1] + "(s)! (+20 Pts)";
        } else {
            document.getElementById("loot_comment").innerHTML = "Chest #1 has " + loot_box_1_amount + " " + loot_pool[loot_box_1] + "! (+20 Pts)";
        }
        document.getElementById("chest_1").innerHTML = ")";
        document.getElementById("chest_1").disabled = true;
        total_crates -= 1;
        Core_Add_Loot(1);
    }
    if(chest == 2) {
        if(loot_box_2_amount >= 2) {
            document.getElementById("loot_comment").innerHTML = "Chest #2 has " + loot_box_2_amount + " " + loot_pool[loot_box_2] + "(s)! (+20 Pts)";
        } else {
            document.getElementById("loot_comment").innerHTML = "Chest #2 has " + loot_box_2_amount + " " + loot_pool[loot_box_2] + "! (+20 Pts)";
        }
        document.getElementById("chest_2").innerHTML = ")";
        document.getElementById("chest_2").disabled = true;
        total_crates -= 1;
        Core_Add_Loot(2);
    }
    if(chest == 3) {
        if(loot_box_3_amount >= 2) {
            document.getElementById("loot_comment").innerHTML = "Chest #3 has " + loot_box_3_amount + " " + loot_pool[loot_box_3] + "(s)! (+20 Pts)";
        } else {
            document.getElementById("loot_comment").innerHTML = "Chest #3 has " + loot_box_3_amount + " " + loot_pool[loot_box_3] + "! (+20 Pts)";
        }
        document.getElementById("chest_3").innerHTML = ")";
        document.getElementById("chest_3").disabled = true;
        total_crates -= 1;
        Core_Add_Loot(3);
    }

    if(total_crates == 0) {
        setTimeout(function() {Core_End_Of_Loot()}, 2500);
    }
}

function Core_Add_Loot(chest) {
    var itemIndex = window["loot_box_" + chest];
    var itemAmount = window["loot_box_" + chest + "_amount"];
    var itemName = loot_pool[itemIndex];

    var inventoryKeyMap = {
        "Gold": "gold",
        "Health Potion": "pot_health",
        "Food": "food",
        "Strength Potion": "pot_damage",
        "Armor Potion": "pot_armor",
        "Power Potion": "pot_lvl"
    };

    var invKey = inventoryKeyMap[itemName];

    if (invKey && player.inv.hasOwnProperty(invKey)) {
        player.inv[invKey] += itemAmount;
    } else if (invKey) {
        player.inv[invKey] = itemAmount;
    }
}

function Core_End_Of_Loot() {
    document.getElementById("loot_selection").style.display = "none";
    document.getElementById("end_of_end").style.display = "";
}
