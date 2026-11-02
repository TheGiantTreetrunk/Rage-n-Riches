// Standalone Level and Ability Progression System

// Score milestones required to reach each level from 1 to 25
var level_score_milestones = [
    0,      // Level 1 (Starting)
    100,    // Level 2
    250,    // Level 3
    450,    // Level 4
    700,    // Level 5
    1000,   // Level 6
    1400,   // Level 7
    1900,   // Level 8
    2500,   // Level 9
    3200,   // Level 10
    4000,   // Level 11
    4900,   // Level 12
    5900,   // Level 13
    7000,   // Level 14
    8200,   // Level 15
    9600,   // Level 16
    11100,  // Level 17
    12800,  // Level 18
    14700,  // Level 19
    16800,  // Level 20
    19200,  // Level 21
    22000,  // Level 22
    25200,  // Level 23
    29000,  // Level 24
    35000   // Level 25 (Juggernaut Capstone)
];

// Extend the player object tracking for skills and skill points
player.skill_points = 0;
player.ability_levels = {
    light_attack: 1,
    ability1: 1,      // Utility / Armor Buff slot
    signature: 1,     // Signature Attack (Heavy replacement)
    heal: 1           // Potion / Heal slot
};

// Check and update player level based on global score (rb_core_score from core.js)
function Check_Player_Level_Up() {
    var currentScore = rb_core_score;
    var targetLevel = player.lvl;

    // Find the highest level threshold the score qualifies for
    for (let i = level_score_milestones.length - 1; i >= 0; i--) {
        if (currentScore >= level_score_milestones[i]) {
            targetLevel = i + 1;
            break;
        }
    }

    // If player leveled up, grant rewards and skill points
    if (targetLevel > player.lvl) {
        var levelsGained = targetLevel - player.lvl;
        player.lvl = targetLevel;
        player.skill_points += levelsGained;

        // Stat scaling into juggernaut territory
        Scale_Juggernaut_Stats();
        
        // Notify player in combat screen if active
        if (typeof document !== 'undefined' && document.getElementById("en_bs_sc")) {
            document.getElementById("en_bs_sc").innerHTML += ` <br><b>LEVEL UP! You reached Level ${player.lvl}! (+${levelsGained} Skill Point)</b>`;
        }
    }
}

// Juggernaut Stat Multipliers per level
function Scale_Juggernaut_Stats() {
    var classIndex = player.class;
    if (classIndex === 0) return;

    var baseHp  = class_health[classIndex];
    var baseDmg = class_damage[classIndex];
    var baseArm = class_armor[classIndex];

    // Scaling curve making them an absolute juggernaut by level 25
    var scalingFactor = 1 + ((player.lvl - 1) * 0.25); // +25% stats per level

    player.hp  = Math.floor(baseHp * scalingFactor);
    player.dmg = Math.floor(baseDmg * scalingFactor);
    player.arm = Math.floor(baseArm * scalingFactor);
    player.thp = player.arm;
}

function Upgrade_Player_Ability(abilityKey) {
    if (player.skill_points <= 0) {
        alert("You don't have any Skill Points available! Gain score to level up.");
        return;
    }

    if (player.ability_levels[abilityKey] >= 4) {
        alert("This ability is already at maximum Tier 4!");
        return;
    }

    // Deduct point and upgrade ability
    player.skill_points--;
    player.ability_levels[abilityKey]++;

    // Refresh the stats screen interface
    Render_Hero_Stats_Screen();
}

// Helper to refresh the stats UI elements inside #sc_dr_sts
function Render_Hero_Stats_Screen() {
    if (document.getElementById("player_skill_points_display")) {
        document.getElementById("player_skill_points_display").innerHTML = `Skill Points Available: ${player.skill_points}`;
    }

    // Update text labels for ability levels
    if (document.getElementById("lvl_light_attack")) {
        document.getElementById("lvl_light_attack").innerHTML = player.ability_levels.light_attack;
        document.getElementById("lvl_heavy_attack").innerHTML = player.ability_levels.heavy_attack;
        document.getElementById("lvl_ability1").innerHTML = player.ability_levels.ability1;
        document.getElementById("lvl_signature").innerHTML = player.ability_levels.signature;
    }
}