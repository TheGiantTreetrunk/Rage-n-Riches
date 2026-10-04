var isincombat = 0;

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

// Tracks player action cooldown to prevent spamming actions during cast times
var player_is_acting = false; 

function Core_Engine_Combat(comand) {
    if(comand == 0) {
        for (let i = 0; i < enemy_clr.length; i++) {
            document.getElementById("enemy_battle_icon").classList.remove(enemy_clr[i]);
        }

        document.getElementById("en_bs_end_of").style.display = "none";
        document.getElementById("combat_books").style.display = "";
        isincombat = 1;
        player_is_acting = false;

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

        // PLAYER DEFEAT
        if(player.hp <= 0) {
            player.hp = 0;
            isincombat = 0;
            clearInterval(intervalId); // Stop enemy attack loop instantly
            document.getElementById("player_battle_health").innerHTML = player.hp;
            document.getElementById("player_battle_armor").innerHTML = player.thp;
            document.getElementById("en_bs_end_of").style.display = "";
            document.getElementById("combat_books").style.display = "none";
            document.getElementById("en_bs_sc").innerHTML = "You have been defeated by the " + enemy.name + "...";
            encounter_outcome = 5;
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
            document.getElementById("en_bs_sc").innerHTML = "You have defeated the " + enemy.name + "!";
            encounter_outcome = 3;
            rb_core_has_completed_first_flr_cmbt = 1;
        }
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

// PLAYER ACTIONS

// 1. Light Attack
function Core_Player_Light_Attack() {
    if (isincombat == 0 || player_is_acting) return;
    
    player_is_acting = true;
    var castTime = class_light_attk_speed[player.class];
    document.getElementById("en_bs_sc").innerHTML = "Preparing Light Attack...";

    setTimeout(function() {
        if (isincombat == 1) {
            var dmg = Math.floor(Math.random() * class_damage[player.class]) + 1;
            Apply_Damage_To_Target(enemy, dmg);
            document.getElementById("en_bs_sc").innerHTML = "You deal " + dmg + " damage with a Light Attack!";
            Core_Engine_Combat(1);
        }
        player_is_acting = false;
    }, castTime);
}

// 2. Heavy Attack
function Core_Player_Heavy_Attack() {
    if (isincombat == 0 || player_is_acting) return;

    player_is_acting = true;
    var castTime = class_heavy_attk_speed[player.class];
    document.getElementById("en_bs_sc").innerHTML = "Charging Heavy Attack...";

    setTimeout(function() {
        if (isincombat == 1) {
            var baseDmg = class_damage[player.class];
            var dmg = Math.floor(Math.random() * baseDmg) + Math.floor(baseDmg * 0.5) + 1; // 1.5x damage potential
            Apply_Damage_To_Target(enemy, dmg);
            document.getElementById("en_bs_sc").innerHTML = "You strike hard for " + dmg + " damage!";
            Core_Engine_Combat(1);
        }
        player_is_acting = false;
    }, castTime);
}

// 3. Shield / Armor Buff
function Core_Player_Armor_Buff() {
    if (isincombat == 0 || player_is_acting) return;

    player_is_acting = true;
    var castTime = class_armor_attk_speed[player.class];
    document.getElementById("en_bs_sc").innerHTML = "Raising Armor...";

    setTimeout(function() {
        if (isincombat == 1) {
            var gainArmor = Math.floor(Math.random() * 3) + 2; // Gains 2-4 temp armor
            player.thp += gainArmor;
            document.getElementById("en_bs_sc").innerHTML = "You gained " + gainArmor + " temporary armor!";
            Core_Engine_Combat(1);
        }
        player_is_acting = false;
    }, castTime);
}

// 4. Heal Health
function Core_Player_Health_Heal() {
    if (isincombat == 0 || player_is_acting) return;

    player_is_acting = true;
    var castTime = class_health_heal_speed[player.class];
    document.getElementById("en_bs_sc").innerHTML = "Healing...";

    setTimeout(function() {
        if (isincombat == 1) {
            var healAmount = Math.floor(Math.random() * 4) + 2; // Heals 2-5 HP
            player.hp += healAmount;
            
            // Optional max health check if player.max_hp exists:
            if (player.max_hp && player.hp > player.max_hp) {
                player.hp = player.max_hp;
            }

            document.getElementById("en_bs_sc").innerHTML = "You restored " + healAmount + " health!";
            Core_Engine_Combat(1);
        }
        player_is_acting = false;
    }, castTime);
}