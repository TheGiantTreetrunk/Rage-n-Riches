/**
dice unicodes
⚀ &#9856; (Dice-1)
⚁ &#9857; (Dice-2)
⚂ &#9858; (Dice-3)
⚃ &#9859; (Dice-4)
⚄ &#9860; (Dice-5)
⚅ &#9861; (Dice-6)
**/

var bribes_given = 0; 
var repairs_made = 0;

const narratorDB = {
    "battle_start": ["A {name} blocks your path. Try not to embarrass yourself.", "Oh look, a {name}. How original."],
    "slap_success": ["PIMP SLAP! Emotional Damage! The {name} is sobbing.", "You slapped the soul out of that {name}."],
    "slap_fail": ["You tried to slap it, but it just looked like a weird caress.", "Physicality: 1, Your Dignity: 0."],
    "bribe_success": ["Capitalism wins! They took the gold and left.", "You literally paid them to leave. Peak heroics."],
    "repair_success": ["Patched up and ready for more abuse.", "Mechanic skills: 100. Wallet: -{cost}G."],
    "door_fail": ["The door won. How does it feel to be outsmarted by oak?", "Stubbed toe. -1 HP. The door is unimpressed."]
};

function getRoast(category, enemyName = "", cost = "") {
    const options = narratorDB[category];
    let roast = options[Math.floor(Math.random() * options.length)];
    return roast.replace("{name}", enemyName).replace("{cost}", cost);
}


var difficulty = 0;
var section = 0;
var enemies_defeated = 0;
var items_opened = 0;
var items_smashed = 0;
var gold_earned = 0;
var rooms_cleared = 0;

//rooms and items
var itm_nm = ["Gold","Food","Water","Potion","Armor","Weapon","Scrolls"];
/*
// logic for what each item "Upgrades" or "Restores"
var itm_effects = {
    "Food":    { stat: "hp",       value: 5,  type: "restore" },
    "Water":   { stat: "stv",      value: -3, type: "restore" }, // Lowers stress!
    "Armor":   { stat: "thp",      value: 5,  type: "restore" }, // Repairs armor
    "Potion":  { stat: "mobility", value: 1,  type: "upgrade" },
    "Weapon":  { stat: "strength", value: 1,  type: "upgrade" },
    "Scrolls": { stat: "academic", value: 1,  type: "upgrade" }
};
*/
var room = 0;
var score = 0;
var gold = 0;

// --- PLAYER BASELINE ATTRIBUTES ---
var player = {
    nme: "Adventurer",
    class: "None",
    hp: 40,      // Baseline increased from 20
    mhp: 40,     // Max HP baseline
    thp: 20,     // Starting Armor baseline
    str: 10,     // Baseline Damage
    mob: 10,     // Baseline Dodge
    aca: 10,     // Baseline Logic
    stv: 0,
	status: "Normal"
};

// Buffed Class Health Array (Matching the new baseline)
var player_class_health = [0, 60, 35, 50, 45, 40, 70, 45, 35];

// --- INVENTORY (Mapped to your itm_nm array) ---
// [Gold, Food, Water, Potion, Armor, Weapon, Scrolls]
var inv = [10, 2, 2, 1, 0, 0, 0]; 

// --- SCALING & PROGRESSION TRACKERS ---
var bribes_given = 0;    // Increases BRIBE cost
var repairs_made = 0;    // Increases REPAIR cost
var rooms_cleared = 0;   // Your score / progress


var player_class = ["Hooman","Fighter","Alchemist","Theologian","Ranger","Monk","Knight","Troubadour","Artillerist"];
var player_cls_val = [];
var player_colors = ["white","red","blue","brown","green","yellow","purple","cyan","magenta"];
var player_class_health =   [0, 12,  6, 12, 10,  8, 14, 10,  8];
var player_class_academic = [0,  6, 14, 12,  8, 10,  6, 12, 14];
var player_class_mobility = [0,  8, 10,  6, 12, 14,  6, 10,  8];
var player_class_strength = [0, 14,  6, 10, 10,  8, 14,  8, 10];
var player_class_health_value =   [0, 5, 0, 2, 1, 1, 3, 1, 0];
var player_class_academic_value = [0, 0, 3, 2, 0, 0,-1, 1, 3];
var player_class_mobility_value = [0, 0, 0, 0, 1, 3,-1, 1,-1];
var player_class_strength_value = [0, 1,-1, 0, 1, 0, 1, 0, 0];
var player_class_unique_weapon = ["Zweihandler","Musket","Mace","Long Bow","Quarterstaff","Long Sword","Rapier","Rifle"];
var player_class_unique_armor = ["Field Plate","Simple Clothes","Brigandine","Leather Coat","Padded Gambeson","Gothic Plate","Mail Hauberk","Leather Coat"];
var player_class_unique_shield = ["None","None","Heater","None","None","Kite","Buckler","None"];
var player_class_unique_damage = [4,5,2,3,2,3,2,5];
var player_class_unique_stv = [10,1,6,4,2,12,6,4];
var player_class_unique_thp = [10,0,6,4,2,15,6,4];
var player_class_unique_ss = [0,0,1,0,0,2,1,0];

var class_data = {
    1: { name: "Fighter", description: "High Health/Strength (Tank)" },
    2: { name: "Alchemist", description: "Pure Academic (Glass Cannon)" },
    3: { name: "Theologian", description: "Balanced Support" },
    4: { name: "Ranger", description: "Balanced Skirmisher" },
    5: { name: "Monk", description: "Pure Mobility (Evasion)" },
    6: { name: "Knight", description: "Durable Tank (Health/Strength)" },
    7: { name: "Troubadour", description: "Jack of All Trades" },
    8: { name: "Artillerist", description: "Focused Academic, Frail" }
};

var enemy_nme = ["Ghost","Glarb","Serpant","Golem","Skeleton","Toad","Blob","Ember","Goblin"];
var enemy_dmg = [3,4,4,6,3,2,4,4,3];
var enemy_arm = [1,2,2,3,1,1,2,1,2];
var enemy_icn = ["&","?","!",".",",","+",";","=","\x5C"];
var enemy_clr = ["white","green","lime","gray","white","olive","purple","orange","green"];

var enemy_hth = [25, 35, 45, 80, 30, 20, 40, 35, 35];

// --- ENEMY DATABASE ---
var enemy_type = 0; // The current index being fought
// The "Active" enemy stats for the current fight
var enemy = {
    name: "",
    health: 0,
    max_health: 0,
    status: "Normal"
};

function Start() {
    document.getElementById("splash").style.display = "block";
    document.getElementById("menu").style.display = "none";
	document.getElementById("battle").style.display = "none";
	document.getElementById("door").style.display = "none";

}

function hud(callout) {
    // Hide all containers to prevent overlap
    document.getElementById("splash").style.display = "none";
    document.getElementById("menu").style.display = "none";
    document.getElementById("door").style.display = "none";
    document.getElementById("battle").style.display = "none";

    switch(callout) {
        case 0: // Splash -> Class Select
            document.getElementById("menu").style.display = "block";
            break;
        case 10: // SHOW BATTLE
            document.getElementById("battle").style.display = "block";
            initBattleTabs(); 
            break;
        case 11: // SHOW DOOR
            document.getElementById("door").style.display = "block";
            // Ensure the roast text is reset for the new room
            document.getElementById("door_text").innerHTML = "A new door. What's the plan, Chief?";
            break;
    }
}

function class_selection(class_num, button_element) {
    // 1. Manage Button Selection Visuals
    var buttons = document.querySelectorAll('.class_select');
    buttons.forEach(function(button) {
        button.classList.remove('selected');
    });
    button_element.classList.add('selected');

    // 2. Set the Technical Stats in the Player Object
    player.class = class_num;
    player.hp = player_class_health[class_num] || 20;
    player.mhp = player.hp;
    player.str = player_class_strength[class_num] || 5;
    player.aca = player_class_academic[class_num] || 5;
    player.mob = player_class_mobility[class_num] || 5;

    // 3. Handle the CSS Color and Icon Logic
    if (class_data[class_num]) {
        var selected_class = class_data[class_num];
        var selectedColorClass = player_colors[class_num]; // e.g., "red", "blue"

        // Update the Class Select Menu UI
        document.getElementById("name_of_class").innerHTML = selected_class.name;
        document.getElementById("class_description").innerHTML = selected_class.description;
        
        // This keeps your @ icon colored correctly
        document.getElementById("class_icon").innerHTML = `<a class='icns ${selectedColorClass}'>@</a>`;
        
        // Update the Battle Icon color ahead of time
        document.getElementById("player_battle_icon").className = `icns ${selectedColorClass}`;
        
        // Display stats in the menu
        document.getElementById("class_stats").innerHTML = `
            <a class='red icns'>~</a> ${player_class_health_value[class_num]} 
            <a class='white icns'> }</a> ${player_class_academic_value[class_num]} 
            <a class='yellow icns'>|</a> ${player_class_mobility_value[class_num]} 
            <a class='purple icns'>{</a> ${player_class_strength_value[class_num]}`;
    }
}

function Door_Action(type) {
    let doorLog = document.getElementById("door_text"); 
    
    if (type === 'kick') {
        if (Math.random() > 0.5) {
            doorLog.innerHTML = "SUCCESS! You dynamic-entered that room.";
            
            setTimeout(() => { 
                hud(10);          // Switch to Battle Screen
                Battle_System(0); // Spawn the enemy
            }, 1000);
            
        } else {
            // FIX: Changed player_hp to player.hp to match your object
            player.hp -= 1; 
            doorLog.innerHTML = getRoast("door_fail");
            
            // Safety check: if you die from kicking a door
            if (player.hp <= 0) {
                alert("You actually died kicking a door. That's impressive.");
                location.reload(); 
            }
        }
    } else if (type === 'knock') {
        doorLog.innerHTML = "You knocked politely. Manners are great, but the monster is still there.";
        
        setTimeout(() => { 
            hud(10); 
            Battle_System(0); 
        }, 1500);
    }
}


function Battle_System(callout) {
    let log = document.getElementById("encounter_battle_test");
    // Scaling Costs based on your global trackers
    let bribe_cost = 5 + (bribes_given * 5);
    let repair_cost = 3 + (repairs_made * 4);

    switch(callout) {
        case 0: // SPAWN ENEMY
            enemy_type = Math.floor(Math.random() * enemy_nme.length);
            
            // Set the active stats for this specific fight into the object
            enemy = {
                name: enemy_nme[enemy_type],
                hp: enemy_hth[enemy_type],
                max_hp: enemy_hth[enemy_type],
                dmg: enemy_dmg[enemy_type],
                arm: enemy_arm[enemy_type],
                icon: enemy_icn[enemy_type],
                color: enemy_clr[enemy_type]
            };

            log.innerHTML = getRoast("battle_start", enemy.name);
            Battle_System(1); // Refresh UI to show new enemy
            break;

        case 1: // REFRESH UI
            // Update Player Stats from the player object
            document.getElementById("player_battle_health").innerHTML = player.hp;
            document.getElementById("player_battle_armor").innerHTML = player.thp;
            
            // Update Enemy Stats from the active enemy object
            document.getElementById("enemy_battle_health").innerHTML = enemy.hp;
            document.getElementById("enemy_battle_armor").innerHTML = enemy.arm;
            document.getElementById("enemy_battle_icon").innerHTML = enemy.icon;
            document.getElementById("enemy_battle_icon").className = `icns ${enemy.color}`;

            // Update Dynamic Button Text
            if(document.getElementById("bribe_btn")) 
                document.getElementById("bribe_btn").innerHTML = `BRIBE (${bribe_cost}G)`;
            if(document.getElementById("repair_btn")) 
                document.getElementById("repair_btn").innerHTML = `REPAIR (${repair_cost}G)`;
            break;

        case 2: // SWORD STRIKE
    enemy.hp -= player.str; 
    log.innerHTML = `You hit the ${enemy.name} for ${player.str} damage.`;
    
    Battle_System(1); // Refresh health

    if (enemy.hp <= 0) {
        Battle_System(9); // Victory!
    } else {
        // The enemy is still alive, so it's their turn
        setTimeout(enemy_turn, 800); 
    }
    break;

        case 5: // HEAL (Uses Food)
            if (inv[1] > 0) { 
                inv[1]--;
                player.hp += 5; // Use player.hp object
                if(player.hp > player.mhp) player.hp = player.mhp; // Don't over-heal
                log.innerHTML = "You ate some food. Tastes like survival.";
            } else {
                log.innerHTML = "You're out of food, genius.";
            }
            Battle_System(1);
            break;

        case 13: // THE BRIBE
            if (inv[0] >= bribe_cost) {
                inv[0] -= bribe_cost;
                if (Math.random() > 0.3) { 
                    bribes_given++;
                    log.innerHTML = getRoast("bribe_success");
                    setTimeout(() => { hud(11); }, 1500); // Back to next door
                } else {
                    log.innerHTML = "They took the money and stayed. FAFO.";
                }
            } else {
                log.innerHTML = "Too broke to be this lazy.";
            }
            Battle_System(1);
            break;

        case 15: // THE PIMP SLAP
            if (Math.random() > 0.7) {
                log.innerHTML = getRoast("slap_success", enemy.name);
                enemy.hp -= 1; // Emotional Damage
            } else {
                log.innerHTML = getRoast("slap_fail");
                player.hp -= 1; // Hurt your dignity (and HP)
            }
            Battle_System(1);
            break;

        case 16: // REPAIR ARMOR
            if (inv[0] >= repair_cost) {
                inv[0] -= repair_cost;
                repairs_made++;
                player.thp += 5; // Restore Armor in player object
                log.innerHTML = getRoast("repair_success", "", repair_cost);
            } else {
                log.innerHTML = "Parts are expensive. You're broke.";
            }
            Battle_System(1);
            break;

        case 9: // VICTORY
            rooms_cleared++;
            log.innerHTML = `The ${enemy.name} is dead. Looting...`;
            
            // Add random gold find
            let loot = Math.floor(Math.random() * 5) + 1;
            inv[0] += loot;
            
            setTimeout(() => { 
                hud(11); // Switch back to Door Scene
            }, 2000);
            break;
    }
}

function enemy_turn() {
    let log = document.getElementById("encounter_battle_test");
    
    // Calculate damage: Enemy Dmg - (tiny bit of player mobility luck)
    let damage = enemy.dmg; 
    
    // 1. Check Armor (THP) first
    if (player.thp > 0) {
        let armorDamage = Math.min(player.thp, damage);
        player.thp -= armorDamage;
        damage -= armorDamage;
        log.innerHTML += `<br>Your armor soaked up ${armorDamage} damage!`;
    }

    // 2. Remaining damage hits HP
    if (damage > 0) {
        player.hp -= damage;
        log.innerHTML += `<br>The ${enemy.name} hits you for ${damage} HP!`;
    }

    // 3. Update UI and check for Death
    Battle_System(1); // Refresh the bars
    
    if (player.hp <= 0) {
        log.innerHTML = "You died. The Narrator is laughing at your corpse.";
        setTimeout(() => { location.reload(); }, 3000);
    }
}

function openPage(evt, pageName) {
    let i, tabcontent, tablinks;
    
    // Hide all pages
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Deactivate all tab buttons
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the specific page and highlight the tab
    document.getElementById(pageName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Call this function whenever you trigger a battle
function initBattleTabs() {
    // Hide all tab content except the first one
    let tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    // Show the Strike page by default
    document.getElementById("Page_Strike").style.display = "block";
    
    // Make sure the first tab button is marked as active
    let tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    tablinks[0].classList.add("active");
}