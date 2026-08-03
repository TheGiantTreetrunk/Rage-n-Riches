function renderClassTable() {
	document.getElementById("class_selection_container").innerHTML = "";
	
    let tableHtml = '<table style="margin: auto; text-align: center;"><tr>';
    let cols = 3;

    for (let i = 0; i < 7; i++) {
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
    
    var buttons = document.querySelectorAll('.class_select');
    buttons.forEach(function(button) {
        button.classList.remove('selected');
    });
    button_element.classList.add('selected');

    
    player.class = class_num;
    player.hp = class_health[class_num];
    player.str = class_damage[class_num];
    player.thp = class_armor[class_num];
    
    
    player.weapon_mult = 1.0; 
    player.isPanicked = false;
    player.stress = 0;

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