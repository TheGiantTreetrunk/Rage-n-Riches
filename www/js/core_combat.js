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