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

var class_light_attk_speed  = [1000, 1500, 1800, 1300, 1600, 1100, 2200];
var class_heavy_attk_speed  = [1500, 2600, 3000, 2200, 2500, 1900, 3500];
var class_armor_attk_speed  = [1000, 1800, 2200, 1400, 1600, 1200, 2000];
var class_health_heal_speed = [1000, 2000, 2400, 1800, 1200, 1600, 2800];

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

function Core_Inventory() {
    document.getElementById("gold_total").innerHTML = player.inv.gold;
    document.getElementById("hth_pot_total").innerHTML = player.inv.pot_health;
    document.getElementById("pos_pot_total").innerHTML = player.inv.pot_poison;
    document.getElementById("arm_pot_total").innerHTML = player.inv.pot_armor;

    document.getElementById("dmg_pot_total").innerHTML = player.inv.pot_damage;
    document.getElementById("spd_pot_total").innerHTML = player.inv.pot_speed;
    document.getElementById("food_total").innerHTML = player.inv.food;
    document.getElementById("water_total").innerHTML = player.inv.water;
}