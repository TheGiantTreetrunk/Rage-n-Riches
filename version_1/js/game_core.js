var is_dev = 1;
var day = 0;
var distance = 0;

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

var terrain = [0,0,0,0,0,0,0,0,0,0];
var terrain_type = ["Flat","Hills","Mountains"];
var weather = [0,0,0,0,0,0,0,0,0,0];
var weather_type = ["Clear","Cloudy","Rain","Snow"];

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

var combat = 0;
var plyr_points = 0;
var enmy_points = 0;

function Hud(comand){
	document.getElementById("mm").style.display = "none";
	document.getElementById("htp").style.display = "none";
	document.getElementById("rooster").style.display = "none";
	document.getElementById("store_front").style.display = "none";
    document.getElementById("day_counter_hud").style.display = "none";
    document.getElementById("story_board").style.display = "none";
    document.getElementById("battle").style.display = "none";

    if(comand == 0) {
        document.body.classList.add('body_class_main_menu');
		document.getElementById("mm").style.display = "block";
    }

    if(comand == 1) {
		document.getElementById("rooster").style.display = "block";
        if(is_dev == 0) {
		    renderClassTable();
        } else {
            cheatUnlockAll();
        }
    }

    if(comand == 2) {
		document.getElementById("htp").style.display = "block";
    }

    if(comand == 3) {
		if(player.class != 0) {
            document.getElementById("rooster").style.display = "block";
            toggleFade();
            setTimeout(toggleFade, 2000);
            setTimeout(function(){ document.getElementById("rooster").style.display = "none" }, 1200);
            setTimeout(function(){ document.getElementById("store_front").style.display = "block" }, 1500);
            setTimeout(function(){ document.body.classList.remove('body_class_main_menu'); }, 1500);
            setTimeout(function(){ document.body.classList.add('body_class_hut'); }, 1500);
            setTimeout(Hud(4), 1750);
		} else {
            
			document.getElementById("rooster").style.display = "block";

		}
    }

    if(comand == 4) {
        var selected_class = class_data[player.class];
        var selectedColorClass = class_colors[player.class]; 

        document.getElementById("name_of_class1").innerHTML = selected_class.name.toUpperCase();
        document.getElementById("tavern_day").innerHTML = "Day " + day + "<br>" + "Distance Traveled " + distance + " --km";
        
        document.getElementById("class_icon1").innerHTML = `<a class='icns ${selectedColorClass}'>@</a>`;
        document.getElementById("class_level").innerHTML = "Level " + player.lvl;
        let gearInfo = `<br><span style='font-size:10px; color:#888;'>WEAPON: ${class_unique_weapon[player.class]}<br>
                        ARMOR: ${class_unique_armor[player.class]}</span>`;

        document.getElementById("class_stats1").innerHTML = `
            <a class='red icns'>~</a> ${class_health[player.class]} 
            <a class='yellow icns'>$</a> ${class_damage[player.class]} 
            <a class='purple icns'>%</a> ${class_armor[player.class]}
            ${gearInfo}`;

        document.getElementById("gold_total").innerHTML = player.inv.gold;
        document.getElementById("hth_pot_total").innerHTML = player.inv.gold;
        document.getElementById("pos_pot_total").innerHTML = player.inv.gold;
        document.getElementById("arm_pot_total").innerHTML = player.inv.gold;

        document.getElementById("dmg_pot_total").innerHTML = player.inv.gold;
        document.getElementById("spd_pot_total").innerHTML = player.inv.gold;
        document.getElementById("food_total").innerHTML = player.inv.gold;
        document.getElementById("water_total").innerHTML = player.inv.gold;

        document.getElementById("wood_total").innerHTML = player.inv.gold;
        document.getElementById("steel_total").innerHTML = player.inv.gold;
        document.getElementById("ruby_total").innerHTML = player.inv.gold;
        document.getElementById("daimond_total").innerHTML = player.inv.gold;
    }

    if(comand == 5) {
            document.getElementById("embark_day_counter").style.display = "none";
            document.getElementById("embark_distance_counter").style.display = "none";
            document.getElementById("embark_cont_bttn").style.display = "none";
            toggleFade();
            setTimeout(function(){ document.getElementById("store_front").style.display = "none" }, 1200);
            setTimeout(function(){ document.getElementById("day_counter_hud").style.display = "block" }, 1500);
            setTimeout(function(){ document.body.classList.remove('body_class_hut'); }, 1500);
            setTimeout(function(){ document.body.classList.add('body_class_hut'); }, 1500);

            setTimeout(function(){ document.getElementById("embark_day_counter").style.display = "block" }, 1500);
            setTimeout(function(){ document.getElementById("embark_distance_counter").style.display = "block" }, 2000);
            setTimeout(function(){ document.getElementById("embark_cont_bttn").style.display = "block" }, 2500);
    }

    if(comand == 6) {
        document.getElementById("day_counter_hud").style.display = "none";
        setTimeout(toggleFade, 2000);
        setTimeout(function(){ document.getElementById("story_board").style.display = "block" }, 3500);
        showNode('start');
    }

    if(comand == 7) {
    }

    if(comand == 8) {
    }

    if(comand == 9) {
    }
}

function toggleFade() {
    document.getElementById('fadeElement').classList.toggle('fade-out');
}