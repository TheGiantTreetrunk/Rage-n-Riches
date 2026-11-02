var isincombat = 0;

var class_unique_ability_name = [
    "None", 
    "Shield Slam", 
    "Phalanx Wall", 
    "Acid Splash", 
    "Divine Ward", 
    "Evasive Roll", 
    "Shrapnel Mine", 
    "Debug Wipe"
];

// Cast speeds for each class's unique ability (in milliseconds)
var class_unique_ability_speed = [500, 1400, 2000, 1200, 1500, 1000, 2500, 400];

// Speed for the universal slap
var universal_slap_speed = 400;

var class_signature_speed = [1500, 2600, 3000, 2200, 2500, 2800, 3500, 500];

// Array for Ability 2 / Signature Attack Names
var class_signature_name = [
    "Desperate Swing", 
    "Cleave", 
    "Decapitate", 
    "Philosopher's Flame", 
    "Smite", 
    "Snipe", 
    "Mortar Volley", 
    "Memory Leak"
];

var enemy_nme = ["Ghost","Glarb","Serpant","Golem","Skeleton","Toad","Blob","Ember","Goblin"];
var enemy_hth = [3,4,3,8,4,2,2,2,4];
var enemy_dmg = [3,4,4,6,3,2,4,4,3];
var enemy_arm = [1,2,2,3,1,1,2,1,2];
var enemy_spd = [1500,1500,1000,3000,1500,1500,2500,3000,1500];
var enemy_icn = ["&","?","!",".",",","+",";","=","\x5C"];
var enemy_clr = ["white","green","lime","gray","white","olive","purple","orange","green"];

// Boss specific arrays / lists
var boss_nme = ["Dread Lord", "Behemoth", "Abyssal Horror", "Titan"];
var boss_icn = ["W", "M", "X", "V"];
var boss_clr = ["red", "purple", "orange", "gray"];

var enemy = {
    id: 0,
    name: "",
    health: 0,
    armor: 0,
    dmg: 0,
    isBoss: false
};

var player_cooldowns = {
    light_attack: 0,
    ability1: 0,
    signature: 0,
    heal: 0,
    slap: 0
};

// Tracks player action cooldown to prevent spamming actions during cast times
var player_is_acting = false; 

function Core_Engine_Combat(comand) {
    if(comand == 0) {
        for (let i = 0; i < enemy_clr.length; i++) {
            document.getElementById("enemy_battle_icon").classList.remove(enemy_clr[i]);
        }
        // Also clean up boss colors just in case
        for (let i = 0; i < boss_clr.length; i++) {
            document.getElementById("enemy_battle_icon").classList.remove(boss_clr[i]);
        }

        document.getElementById("en_bs_end_of").style.display = "none";
        document.getElementById("combat_books").style.display = "";
        document.getElementById("bs_commands").style.display = "";
        isincombat = 1;
        player_is_acting = false;

        var enmy = Math.floor(Math.random() * enemy_nme.length);
        enemy.id = enmy;
        enemy.name = enemy_nme[enmy];
        enemy.health = enemy_hth[enmy];
        enemy.armor = enemy_arm[enmy];
        enemy.dmg = enemy_dmg[enmy];
        enemy.isBoss = false;
        
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

        // PLAYER DEFEAT
        if(player.hp <= 0) {
            player.hp = 0;
            isincombat = 0;
            clearInterval(intervalId); // Stop enemy attack loop instantly
            document.getElementById("player_battle_health").innerHTML = player.hp;
            document.getElementById("player_battle_armor").innerHTML = player.thp;
            document.getElementById("en_bs_end_of").style.display = "";
            document.getElementById("combat_books").style.display = "none";
            document.getElementById("en_bs_sc").innerHTML = "You have been defeated by " + (enemy.isBoss ? "the boss " : "") + enemy.name + "...";
            encounter_outcome = 5;
            Engine_Hud(13);
        }

        // ENEMY DEFEAT
        if(enemy.health <= 0) {
            enemy.health = 0;
            isincombat = 0;
            clearInterval(intervalId); // Stop enemy attack loop instantly
            document.getElementById("enemy_battle_health").innerHTML = enemy.health;
            document.getElementById("enemy_battle_armor").innerHTML = enemy.armor;
            document.getElementById("en_bs_end_of").style.display = "";
            document.getElementById("combat_books").style.display = "none";
            
            if (enemy.isBoss) {
                document.getElementById("en_bs_sc").innerHTML = "INCREDIBLE! You have slain the boss, " + enemy.name + "!";
                encounter_outcome = 6; // Or handle boss-specific victory rewards/flags here
                rb_core_has_completed_first_flr_cmbt = 1;
            } else {
                document.getElementById("en_bs_sc").innerHTML = "You have defeated the " + enemy.name + "!";
                encounter_outcome = 3;
                rb_core_has_completed_first_flr_cmbt = 1;
            }
        }
    }
}

// BOSS ENCOUNTER CORE GENERATION
function Core_Engine_Combat_Boss(comand) {
    if(comand == 0) {
        for (let i = 0; i < enemy_clr.length; i++) {
            document.getElementById("enemy_battle_icon").classList.remove(enemy_clr[i]);
        }
        for (let i = 0; i < boss_clr.length; i++) {
            document.getElementById("enemy_battle_icon").classList.remove(boss_clr[i]);
        }

        document.getElementById("en_bs_end_of").style.display = "none";
        document.getElementById("combat_books").style.display = "";
        isincombat = 1;
        player_is_acting = false;

        var bsn = Math.floor(Math.random() * boss_nme.length);
        enemy.id = bsn;
        enemy.name = boss_nme[bsn];
        enemy.health = 250;  // Base 250 health
        enemy.armor = 50;    // Base 50 armor
        enemy.dmg = 18;      // High damage scaling per hit
        enemy.isBoss = true;

        document.getElementById("enemy_battle_icon").classList.add(boss_clr[bsn]);
        document.getElementById("enemy_battle_icon").innerHTML = boss_icn[bsn];
        document.getElementById("enemy_battle_health").innerHTML = enemy.health;
        document.getElementById("enemy_battle_armor").innerHTML = enemy.armor;

        document.getElementById("en_bs_sc").innerHTML = "WARNING! A fearsome Boss, " + enemy.name + ", has appeared!";
        
        // Boss attacks fast and hard (e.g., 1000ms attack interval)
        Core_Enemy_Speed_Adjust(1000);
    }

    if(comand == 1) {
        // Delegates standard win/loss evaluation states to the same UI handler logic
        Core_Engine_Combat(1);
    }
}

let delay = 2000;
let intervalId;

// ENEMY ATTACK (Armor absorbs first)
function Core_Enemy_Damage() {
    if(isincombat == 1) {
        var dablage = Math.floor(Math.random() * enemy.dmg) + 1;
        
        if (player.thp > 0) {
            if (player.thp >= dablage) {
                player.thp -= dablage;
            } else {
                var leftover = dablage - player.thp;
                player.thp = 0;
                player.hp -= leftover;
            }
        } else {
            player.hp -= dablage;
        }

        // Refresh UI state depending on combat type flag
        if (enemy.isBoss) {
            Core_Engine_Combat_Boss(1);
        } else {
            Core_Engine_Combat(1);
        }
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

// GENERAL DAMAGE CALCULATOR (Armor absorbed first)
function Apply_Damage_To_Target(target, damageAmount) {
    if (target.armor > 0) {
        if (target.armor >= damageAmount) {
            target.armor -= damageAmount;
        } else {
            var leftover = damageAmount - target.armor;
            target.armor = 0;
            target.health -= leftover;
        }
    } else {
        target.health -= damageAmount;
    }
}

function Can_Use_Ability(abilityKey, cooldownDuration) {
    var now = Date.now();
    if (player_cooldowns[abilityKey] > now) {
        var timeLeft = ((player_cooldowns[abilityKey] - now) / 1000).toFixed(1);
        document.getElementById("en_bs_sc").innerHTML = `${abilityKey.toUpperCase()} is on cooldown! (${timeLeft}s)`;
        return false;
    }
    
    // Set cooldown expiration time
    player_cooldowns[abilityKey] = now + cooldownDuration;
    return true;
}

function Core_Player_Light_Attack() {
    if (isincombat == 0) return;

    // Base cooldown: 1000ms, reduced by 70ms per ability level
    var lvl = player.ability_levels.light_attack;
    var cooldown = Math.max(300, 1000 - ((lvl - 1) * 200));

    if (!Can_Use_Ability('light_attack', cooldown)) return;

    // INSTANT EXECUTION (No waiting/charging)
    var baseDmg = class_damage[player.class];
    var damageMultiplier = 1 + ((lvl - 1) * 0.35); // Lvl 4 packs a massive punch
    var dmg = Math.floor((Math.random() * baseDmg + 1) * damageMultiplier);

    // Tier 3/4 Bonus: Chance to strike twice or bypass armor partially
    if (lvl >= 3 && Math.random() < 0.25) {
        dmg = Math.floor(dmg * 1.5);
        document.getElementById("en_bs_sc").innerHTML = "CRITICAL STRIKE! ";
    }

    Apply_Damage_To_Target(enemy, dmg);
    document.getElementById("en_bs_sc").innerHTML += `You instantly fire a Light Attack for ${dmg} damage!`;

    Check_Combat_End_States();
}


function Core_Player_Heavy_Attack() {
    if (isincombat == 0) return;

    var lvl = player.ability_levels.heavy_attack || 1;
    var cooldown = Math.max(1500, 4000 - ((lvl - 1) * 500)); // Medium cooldown

    if (!Can_Use_Ability('heavy_attack', cooldown)) return;

    var baseDmg = class_damage[player.class];
    var tierMultiplier = 1 + ((lvl - 1) * 0.4);
    var dmg = Math.floor(baseDmg * 1.5 * tierMultiplier);

    Apply_Damage_To_Target(enemy, dmg);
    document.getElementById("en_bs_sc").innerHTML = `You deliver a crushing Heavy Strike for ${dmg} damage!`;

    Check_Combat_End_States();
}

function Core_Player_Armor_Potion() {
    if (isincombat == 0) return;

    // Check if player has armor potions
    if (player.inv.pot_armor <= 0) {
        document.getElementById("en_bs_sc").innerHTML = "You are out of Armor Potions!";
        return;
    }

    if (!Can_Use_Ability('armor_potion', 3000)) return; // 3 second cooldown

    // Consume 1 Armor Potion
    player.inv.pot_armor--;

    // Grant temporary armor scaling with level or base stats
    var armorGain = 8 + (player.lvl * 2);
    player.thp += armorGain;

    document.getElementById("en_bs_sc").innerHTML = `You drank an Armor Potion! Gained ${armorGain} temporary armor. (Left: ${player.inv.pot_armor})`;
    
    // Update inventory UI if open
    if (typeof Core_Inventory === 'function') { Core_Inventory(); }
    Check_Combat_End_States();
}

function Core_Player_Health_Potion() {
    if (isincombat == 0) return;

    // Check if player has health potions
    if (player.inv.pot_health <= 0) {
        document.getElementById("en_bs_sc").innerHTML = "You are out of Health Potions!";
        return;
    }

    if (!Can_Use_Ability('health_potion', 3000)) return; // 3 second cooldown

    // Consume 1 Health Potion
    player.inv.pot_health--;

    // Restore health scaling with level
    var healAmount = 15 + (player.lvl * 3);
    player.hp += healAmount;

    document.getElementById("en_bs_sc").innerHTML = `You chugged a Health Potion! Restored ${healAmount} HP. (Left: ${player.inv.pot_health})`;
    
    // Update inventory UI if open
    if (typeof Core_Inventory === 'function') { Core_Inventory(); }
    Check_Combat_End_States();
}

function Core_Player_Slap() {
    if (isincombat == 0) return;

    // Check if enemy is at exactly 1 HP
    if (enemy.health !== 1) {
        document.getElementById("en_bs_sc").innerHTML = 
            "The " + enemy.name + " is too strong to be slapped right now! (Must be at exactly 1 HP)";
        return;
    }

    if (!Can_Use_Ability('slap', 1000)) return; // 1 second cooldown

    enemy.health = 0; // Guaranteed execute
    document.getElementById("en_bs_sc").innerHTML = 
        "DISRESPECTFUL FINISH! You instantly slap the " + enemy.name + " to death for 1 damage!";
    
    Check_Combat_End_States();
}

function Core_Player_Unique_Ability() {
    if (isincombat == 0) return;

    var classId = player.class;
    var abilityName = class_unique_ability_name[classId];
    if (abilityName === "None") return;

    var lvl = player.ability_levels.ability1;
    var cooldown = Math.max(2000, 6000 - ((lvl - 1) * 1000)); // Scales down cooldown per tier

    if (!Can_Use_Ability('ability1', cooldown)) return;

    let msg = "";
    // Tier-based scaling power multiplier
    var tierPower = 1 + ((lvl - 1) * 0.5);

    switch(classId) {
        case 1: // Fighter: Shield Slam
            var dmg = Math.floor(class_damage[player.class] * 1.2 * tierPower);
            Apply_Damage_To_Target(enemy, dmg);
            msg = `You instantly slam your shield for ${dmg} damage!`;
            if (lvl >= 4) { enemy.armor = Math.max(0, enemy.armor - 5); msg += " (Shattered armor!)"; }
            break;
        case 2: // Knight: Phalanx Wall
            var armorGain = Math.floor(10 * tierPower);
            player.thp += armorGain;
            msg = `You lock your Phalanx Wall, instantly gaining ${armorGain} temp armor!`;
            break;
        case 3: // Alchemist: Acid Splash
            var dmg = Math.floor(8 * tierPower);
            if (enemy.armor > 0) enemy.armor = Math.max(0, enemy.armor - (2 * lvl));
            Apply_Damage_To_Target(enemy, dmg);
            msg = `You fling a volatile chemical flask for ${dmg} direct damage!`;
            break;
        case 4: // Theologian: Divine Ward
            var healAmt = Math.floor(6 * tierPower);
            player.hp += healAmt;
            player.thp += Math.floor(4 * tierPower);
            msg = `Divine Ward instantly restores ${healAmt} health and shields you!`;
            break;
        case 5: // Ranger: Evasive Roll
            var dmg = Math.floor(class_damage[player.class] * 1.5 * tierPower);
            Apply_Damage_To_Target(enemy, dmg);
            msg = `You instantly tumble and snap-shot for ${dmg} damage!`;
            break;
        case 6: // Artillerist: Shrapnel Mine
            var dmg = Math.floor(15 * tierPower);
            Apply_Damage_To_Target(enemy, dmg);
            msg = `Mines detonate instantly, blasting the enemy for ${dmg} damage!`;
            break;
        case 7: // TEST123: Debug Wipe
            var dmg = Math.floor(30 * tierPower);
            Apply_Damage_To_Target(enemy, dmg);
            msg = `[GLITCH] Reality rewrites for ${dmg} damage!`;
            break;
        default:
            var dmg = Math.floor(10 * tierPower);
            Apply_Damage_To_Target(enemy, dmg);
            msg = `Used ${abilityName} for ${dmg} damage!`;
    }

    document.getElementById("en_bs_sc").innerHTML = msg;
    Check_Combat_End_States();
}

function Core_Player_Signature_Attack() {
    if (isincombat == 0) return;

    var classId = player.class;
    var attackName = class_signature_name[classId];

    var lvl = player.ability_levels.signature;
    var cooldown = Math.max(4000, 10000 - ((lvl - 1) * 1500)); // Scales down per level

    if (!Can_Use_Ability('signature', cooldown)) return;

    var baseDmg = class_damage[classId];
    var tierMultiplier = 1 + ((lvl - 1) * 0.6); // Juggernaut scaling
    var dmg = 0;

    switch(classId) {
        case 1: dmg = Math.floor(baseDmg * 2.0 * tierMultiplier); break;
        case 2: dmg = Math.floor((baseDmg * 1.8 + 4) * tierMultiplier); break;
        case 3: 
            dmg = Math.floor(12 * tierMultiplier); 
            enemy.health -= dmg; // Direct health pierce
            break;
        case 4: dmg = Math.floor(baseDmg * 2.2 * tierMultiplier); break;
        case 5: dmg = Math.floor(baseDmg * 2.5 * tierMultiplier); break;
        case 6: dmg = Math.floor(baseDmg * 3.0 * tierMultiplier); break;
        case 7: dmg = Math.floor(99 * tierMultiplier); break;
        default: dmg = Math.floor(baseDmg * 1.5 * tierMultiplier);
    }

    if (classId !== 3) {
        Apply_Damage_To_Target(enemy, dmg);
    }

    document.getElementById("en_bs_sc").innerHTML = `You instantly unleash ${attackName} for ${dmg} damage!`;
    Check_Combat_End_States();
}

function Check_Combat_End_States() {
    if (enemy.isBoss) {
        Core_Engine_Combat_Boss(1);
    } else {
        Core_Engine_Combat(1);
    }
}

function Update_Potion_Counters() {
    // Stash screen totals
    if(document.getElementById("hth_pot_total")) {
        document.getElementById("hth_pot_total").innerHTML = player.inv.pot_health;
    }
    if(document.getElementById("arm_pot_total")) {
        document.getElementById("arm_pot_total").innerHTML = player.inv.pot_armor;
    }

    // Combat action button counters
    if(document.getElementById("combat_hth_pot_count")) {
        document.getElementById("combat_hth_pot_count").innerHTML = `(${player.inv.pot_health})`;
    }
    if(document.getElementById("combat_arm_pot_count")) {
        document.getElementById("combat_arm_pot_count").innerHTML = `(${player.inv.pot_armor})`;
    }
}