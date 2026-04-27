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

var rooms_cleared = 0;
var itm_nm = ["Gold", "Dmg Potion", "Str Potion", "Health Pot", "Scrolls"];
var inv = [10, 0, 0, 1, 0]; 
var bag_limit = 10;
var score = 0;

// --- PLAYER BASELINE ATTRIBUTES ---
var player = {
    nme: "Adventurer",
    class: "None",
    hp: 40,      // Baseline increased from 20
    thp: 20,     // Starting Armor baseline
    str: 10,     // Baseline Damage
    stv: 0,
	status: "Normal",
    dmg_buff: 0,
    arm_buff: 0,
    stress: 0,
    stress_stage: "Calm" // Stages: Calm, Anxious, Stressed, Panicked
};


var player_class = ["Hooman","Fighter","Alchemist","Theologian","Ranger","Monk","Knight","Troubadour","Artillerist"];
var player_colors = ["white","red","blue","brown","green","yellow","purple","cyan","magenta"];
var player_class_health = [0,12,6,12,10,8,14,10,8];
var player_class_damage = [0,4,5,2,3,2,3,2,5];
var player_class_stv = [0,10,1,6,4,2,12,6,4];
var player_class_thp = [0,10,0,6,4,2,15,6,4];
var player_class_unique_weapon = ["Zweihandler","Musket","Mace","Long Bow","Quarterstaff","Long Sword","Rapier","Rifle"];
var player_class_unique_armor = ["Field Plate","Simple Clothes","Brigandine","Leather Coat","Padded Gambeson","Gothic Plate","Mail Hauberk","Leather Coat"];
var player_class_unique_shield = ["None","None","Heater","None","None","Kite","Buckler","None"];

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

function Start() {
    document.getElementById("splash").style.display = "block";
    document.getElementById("menu").style.display = "none";
	document.getElementById("battle").style.display = "none";
	document.getElementById("door").style.display = "none";
    document.getElementById("stats").style.display = "none";
    document.getElementById("loot").style.display = "none";
    rooms_cleared = 0;
}

function hud(callout) {
    // Hide all containers to prevent overlap
    document.getElementById("splash").style.display = "none";
    document.getElementById("menu").style.display = "none";
    document.getElementById("door").style.display = "none";
    document.getElementById("battle").style.display = "none";
    document.getElementById("stats").style.display = "none";
    document.getElementById("loot").style.display = "none";

    switch(callout) {
        case 0: // Splash -> Class Select
            document.getElementById("menu").style.display = "block";
            break;
        case 10: // SHOW BATTLE
            document.getElementById("battle").style.display = "block";
            break;
        case 11: // SHOW DOOR
            document.getElementById("door").style.display = "block";
            // Ensure the roast text is reset for the new room
            document.getElementById("door_text").innerHTML = "A new door. What's the plan, Chief?";
            for (var i = 0; i < 10; i++) {
               document.getElementById(`floor_${i}_id`).innerHTML = "<a class='door white'>_</a><a class='door brown'>:</a>"; 
            }
            document.getElementById(`floor_${rooms_cleared}_id`).innerHTML = "<a id='hero' class='icns'>@</a><a id='door1' class='door brown'>:</a>";
            break;
        case 12:
            document.getElementById("stats").style.display = "block";
            break;
        case 13:
            document.getElementById("door").style.display = "block";
            break;
        case 15: 
            document.getElementById("loot").style.display = "block"; 
            break;
    }
}

function Radar(rooms_cleared) {
    document.getElementById(`floor_ ${rooms_cleared} _id`).innerHTML = "<a id='hero' class='icns'>@</a><a id='door1' class='door brown'>:</a>";
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
    player.hp = player_class_health[class_num];
    player.str = player_class_damage[class_num];
    player.thp = player_class_thp[class_num];
    player.stv = player_class_stv[class_num];

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
            <a class='red icns'>~</a> ${player_class_health[class_num]}
            <a class='yellow icns'>|</a> ${player_class_damage[class_num]} 
            <a class='purple icns'>{</a> ${player_class_thp[class_num]}`;
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

            // Update the new buff indicators
            document.getElementById("dmg_buff_val").innerHTML = player.dmg_buff;
            document.getElementById("arm_buff_val").innerHTML = player.arm_buff;

            // Change color if buffs are active to grab attention
            if (player.dmg_buff > 0 || player.arm_buff > 0) {
                document.getElementById("player_status").style.color = "#00ff00"; // Neon green for active
            } else {
                document.getElementById("player_status").style.color = "gray";
            }
            
           let mentalEl = document.getElementById("player_mental_state");
            if (mentalEl) {
                mentalEl.innerHTML = `MIND: ${player.stress_stage}`;
                mentalEl.style.color = getStressColor();
            }
            break;

        case 2: // SWORD STRIKE
            let total_dmg = player.str + player.dmg_buff;
    
            // Attacking while heavily buffed is mentally taxing
            if (player.dmg_buff > 0 || player.arm_buff > 0) {
                player.stress += 5;
                updateStressStage();
            }

            enemy.hp -= total_dmg;
            log.innerHTML = `You hit the ${enemy.name} for ${total_dmg} damage.`;
            
            Battle_System(1);
            if (enemy.hp <= 0) {
                // Reset stress slightly on victory for that 'relief' feel
                player.stress = Math.max(0, player.stress - 15);
                player.dmg_buff = 0;
                player.arm_buff = 0;
                updateStressStage();
                Battle_System(9); 
            } else {
                setTimeout(enemy_turn, 800); 
            }
            break;

        case 5: // HEAL (Uses Health Pot)
            if (inv[3] > 0) { // Index 3 is Health Pot
                inv[3]--;
                player.hp += 10; 
                // Note: You currently don't have player.mhp (Max HP) defined, 
                // you might want to add that to the player object later.
                log.innerHTML = "You drank a Health Potion.";
            } else {
                log.innerHTML = "You're out of potions!";
            }
            Battle_System(1);
            break;

        case 11: // ANALYZE
            log.innerHTML = `<b>Target:</b> ${enemy.name}<br>`;
            log.innerHTML += `<b>Attack:</b> ${enemy.dmg} | <b>Armor:</b> ${enemy.arm}`;
            
            // Always a quick action so players actually use it
            log.innerHTML += "<br><i>Tactical advantage gained! (Free Action)</i>";
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

        // Replace your potion cases (20 and 21) in Battle_System with this logic
        case 20: // USE DMG POTION
            if (inv[1] > 0) {
                inv[1]--;
                player.dmg_buff += 5;
                player.stress += 10; // "Chemical" stress
                updateStressStage();
                log.innerHTML = "Dmg Potion consumed. Mind racing...";
                
                // Quick Action Check: 40% chance to keep your turn
                if (Math.random() > 0.6) {
                    log.innerHTML += "<br><b>QUICK ACTION!</b> You still have an move.";
                    Battle_System(1);
                } else {
                    setTimeout(enemy_turn, 800);
                }
            }
            break;

        case 21: // USE STR POTION
            if (inv[2] > 0) {
                inv[2]--;
                player.arm_buff += 5;
                player.thp += 5;
                player.stress += 10;
                updateStressStage();
                log.innerHTML = "Str Potion consumed. Body tensing...";

                if (Math.random() > 0.6) {
                    log.innerHTML += "<br><b>QUICK ACTION!</b> You still have an move.";
                    Battle_System(1);
                } else {
                    setTimeout(enemy_turn, 800);
                }
            }
            break;

        // Inside Battle_System switch
        case 22: // USE STRESS RELIEF (Index 4 - Scrolls/Holy Water)
            if (inv[4] > 0) {
                inv[4]--;
                player.stress = Math.max(0, player.stress - 30);
                if (player.isPanicked && player.stress < 50) {
                    player.isPanicked = false;
                    player.str += 5; // Recovery
                    log.innerHTML = "You regained your composure.";
                }
                log.innerHTML = "Stress reduced!";
            }
            Battle_System(1);
            break;

        case 9: // VICTORY
            rooms_cleared++;
            log.innerHTML = `The ${enemy.name} is dead.`;
            
            // Reset combat-only buffs
            player.dmg_buff = 0;
            player.arm_buff = 0;

            setTimeout(() => { 
                processLootDrop(rooms_cleared); 
            }, 1500);
            break;
    }
}

function enemy_turn() {
    let log = document.getElementById("encounter_battle_test");
    let decision = Math.random();

    // 1. Desperation Move: If enemy is low health, they might "Berserk"
    if (enemy.hp < (enemy.max_hp * 0.3) && decision > 0.5) {
        let critDmg = Math.floor(enemy.dmg * 1.5);
        player.hp -= critDmg;
        log.innerHTML = `The ${enemy.name} goes into a frenzy! You take ${critDmg} damage!`;
        addStress(10); // Dealing big damage causes player stress
    } 
    // 2. Tactical Move: If player has high armor buffs, enemy might "Sunder"
    else if (player.arm_buff > 0 && decision > 0.7) {
        player.arm_buff = Math.max(0, player.arm_buff - 5);
        player.thp = Math.max(0, player.thp - 5);
        log.innerHTML = `The ${enemy.name} sunders your defenses! Armor reduced.`;
        addStress(5);
    }
    // 3. Standard Attack
    else {
        let damage = enemy.dmg;
        // ... (Your existing armor-soaking logic)
        player.hp -= damage;
        log.innerHTML = `The ${enemy.name} strikes for ${damage} damage.`;
    }

    Battle_System(1);
    checkPlayerDeath();
}

function getBagCount() {
    // We sum every value in the inv array starting from index 1
    let total = 0;
    for (let i = 1; i < inv.length; i++) {
        total += inv[i];
    }
    return total;
}

function pickUpItem(idx, qty = 1) {
    if (idx === 0) { // Gold always fits
        inv[0] += qty;
        return true; 
    }
    
    if (getBagCount() + qty <= bag_limit) {
        inv[idx] += qty;
        return true;
    }
    return false; // Returns false if it doesn't fit
}

var pendingItem = 0;

function processLootDrop(floor) {
    pendingItem = getLootDrop(floor); 
    
    const iconMap = ["$", "!", "%", "~", "?"];
    const colorMap = ["yellow", "cyan", "blue", "red", "magenta"];
    
    document.getElementById("loot_icon").innerText = iconMap[pendingItem];
    document.getElementById("loot_icon").className = "icns " + colorMap[pendingItem];
    document.getElementById("loot_item_name").innerText = itm_nm[pendingItem].toUpperCase();
    
    // Check if bag is full
    let isFull = getBagCount() >= bag_limit;
    document.getElementById("loot_cap_msg").style.visibility = isFull ? "visible" : "hidden";

    hud(15); // This triggers the centering and display
}

function acceptLoot() {
    if (getBagCount() < bag_limit) {
        inv[pendingItem]++;
        logMessage("Stashed " + itm_nm[pendingItem]);
        hud(11); // Return to dungeon
    } else {
        logMessage("Bag is full! You can't carry anymore.");
    }
}

// Function to close the loot screen and go back to doors
function closeLootUI() {
    document.getElementById("loot").style.display = "none";
    if(rooms_cleared <= 9) {
        hud(11); // Switch back to Door Scene
    } else {
        alert("You Won!");
        Start();
    }
}

function upgradeBag(newLimit) {
    bag_limit = newLimit;
    logMessage("Bag upgraded! You can now carry " + bag_limit + " items.");
}

function updateInventoryUI() {
    let current = getBagCount();
    // Update a div or ASCII line in your HTML
    document.getElementById("bag-status").innerText = `Bag: ${current} / ${bag_limit}`;
    
    // Example: Inventory: Gold: 10 | Dmg: 0 | Str: 0 | HP: 1 | Scroll: 0
    let invString = itm_nm.map((name, i) => `${name}: ${inv[i]}`).join(" | ");
    document.getElementById("inventory-list").innerText = invString;
}

function Stats() {
    // 1. Identification
    // Use the player_class array to get the name string
    document.getElementById("stat_class_name").innerText = player_class[player.class].toUpperCase();
    
    // 2. Core Vitals
    document.getElementById("stat_hp").innerText = "HP: " + player.hp;
    document.getElementById("stat_str").innerText = "ATK: " + player.str;
    document.getElementById("stat_thp").innerText = "ARM: " + player.thp;
    
    // 3. Mental State Styling
    let mentalStat = document.getElementById("player_mental_state_stats");
    mentalStat.innerText = `MIND STATUS: ${player.stress_stage}`;
    mentalStat.style.color = getStressColor(); // Uses your purple/yellow/orange/red logic

    // 4. Inventory Slot Updates
    // Loop through the known item indices (0: Gold, 1: Dmg, 2: Str, 3: HP, 4: Scrolls)
    for (let i = 0; i < 5; i++) {
        let qtyEl = document.getElementById(`inv_qty_${i}`);
        if (qtyEl) {
            qtyEl.innerText = inv[i];
            // Dim the button if the slot is empty for a "ghost" effect
            qtyEl.parentElement.style.opacity = (inv[i] > 0) ? "1.0" : "0.4";
        }
    }

    // 5. Capacity Check
    let currentTotal = getBagCount(); // Helper from your code
    document.getElementById("bag_status_text").innerText = `SYSTEM CAPACITY: ${currentTotal} / ${bag_limit}`;
    
    hud(12); // Display the screen
}

function getLootDrop(floor) {
    let roll = Math.floor(Math.random() * 100) + floor; // Floor adds to the roll

    if (roll < 40) return 0;      // Gold (Still common)
    if (roll < 70) return 3;      // Health Potion
    if (roll < 85) return 1;      // Dmg Potion
    if (roll < 95) return 2;      // Str Potion
    return 4;                     // Scrolls (Rare)
}

function getEliteLoot() {
    // Elites never drop Gold; they only drop consumables (Indices 1-4)
    return Math.floor(Math.random() * 4) + 1; 
}

function addStress(amount) {
    player.stress += amount;
    if (player.stress >= player.max_stress) {
        player.stress = player.max_stress;
        triggerPanic();
    }
    updateUI();
}

function triggerPanic() {
    if (!player.isPanicked) {
        player.isPanicked = true;
        player.str -= 5; // Panic reduces effectiveness
        logMessage("HEART RATE INCREASING... You are PANICKED! (-5 DMG)");
    }
}

function updateStressStage() {
    if (player.stress < 20) {
        player.stress_stage = "CALM";
    } else if (player.stress < 50) {
        player.stress_stage = "ANXIOUS";
    } else if (player.stress < 80) {
        player.stress_stage = "STRESSED";
    } else {
        player.stress_stage = "PANIC";
    }
}

function getStressColor() {
    switch(player.stress_stage) {
        case "CALM": return "#ff00ff";     // Classic 8-bit Purple
        case "ANXIOUS": return "yellow";
        case "STRESSED": return "orange";
        case "PANIC": return "red";
        default: return "white";
    }
}

function checkPlayerDeath() {
    if (player.hp <= 0) {
        // The roast for the final failure
        let log = document.getElementById("encounter_battle_test");
        if (log) {
            log.innerHTML = "You died. The Narrator is laughing at your corpse.";
        } else {
            alert("You actually died. That's impressive.");
        }

        // Delay the reload so the player can process the loss
        setTimeout(() => { 
            location.reload(); 
        }, 3000);
        
        return true; // The player is dead
    }
    return false; // The player lives to fight another round
}