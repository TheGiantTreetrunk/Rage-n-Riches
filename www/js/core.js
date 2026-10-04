var is_dev = 1;
var rb_core_score = 0;

function Start() {

    if (localStorage.getItem('score') === null) {
        localStorage.setItem('score', '0');
    }

    let score = parseInt(localStorage.getItem('score'), 10);
    Engine_Hud(0);
}

function Hud_Effect_Fade() {
    document.getElementById('fadeElement').classList.toggle('fade-out');
}

function trackLogin() {
    const displayElement = document.getElementById('login-info');
    const awayElement = document.getElementById('time-away');
    
    // 1. Get current time in milliseconds
    const now = Date.now(); 

    // 2. Retrieve the previous login (stored as a number string)
    const lastLoginMillis = localStorage.getItem('lastLoginMillis');

    if (lastLoginMillis) {
        const lastDate = new Date(parseInt(lastLoginMillis, 10));
        displayElement.innerHTML = `Last login: <b>${lastDate.toLocaleString()}</b>`;

        // 3. Calculate the difference
        const diffInMs = now - parseInt(lastLoginMillis, 10);
        awayElement.innerText = `You were away for: ${formatTime(diffInMs)}`;
    } else {
        // Updated welcome text and cleared away element for new players
        displayElement.innerHTML = "Welcome new hero!";
        if (awayElement) awayElement.innerText = "";
    }

    // 4. Update localStorage with the current time for next time
    localStorage.setItem('lastLoginMillis', now);
}

// Helper function to turn milliseconds into a readable string
function formatTime(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

function Engine_Hud(comand) {
    //controls the Hud and main visuals (essentially a scene changer)
    document.getElementById("ss").style.display = "none";
    document.getElementById("mm").style.display = "none";
    document.getElementById("cs").style.display = "none";
    document.getElementById("cl").style.display = "none";
    document.getElementById("wrld").style.display = "none";
    document.getElementById("dr").style.display = "none";
    document.getElementById("bs").style.display = "none";
    document.getElementById("en1").style.display = "none";
    document.getElementById("en2").style.display = "none";
    document.getElementById("en3").style.display = "none";
    document.getElementById("en4").style.display = "none";
    document.getElementById("en5").style.display = "none";
    document.getElementById("en6").style.display = "none";
    document.getElementById("en7").style.display = "none";
    document.getElementById("en8").style.display = "none";
    document.getElementById("enout").style.display = "none";
    document.getElementById("ad").style.display = "none";
    document.getElementById("eg").style.display = "none";
    document.getElementById("fclr").style.display = "none";
    document.getElementById("sc_story_line").style.display = "none";
    document.getElementById("shrtct").style.display = "none";

    document.getElementById("sc_dr_inv").style.display = "none";
    document.getElementById("sc_dr_sts").style.display = "none";
    document.getElementById("sc_dr_stry").style.display = "none";

    document.getElementById("rst_pnt").style.display = "none";


    document.getElementById("stars").style.display = "none";
    document.getElementById("stars2").style.display = "none";
    document.getElementById("stars3").style.display = "none";

    document.getElementById("tracker").style.display = "none";
    document.getElementById("water_container").style.display = "none";
    document.getElementById("rb_firepit").style.display = "none";

    document.getElementById("firefly1").style.display = "none";
    document.getElementById("firefly2").style.display = "none";
    document.getElementById("firefly3").style.display = "none";
    document.getElementById("firefly4").style.display = "none";
    document.getElementById("firefly5").style.display = "none";
    document.getElementById("firefly6").style.display = "none";
    document.getElementById("firefly7").style.display = "none";
    document.getElementById("firefly8").style.display = "none";
    document.getElementById("firefly9").style.display = "none";
    document.getElementById("firefly10").style.display = "none";
    document.getElementById("firefly11").style.display = "none";
    document.getElementById("firefly12").style.display = "none";
    document.getElementById("firefly13").style.display = "none";
    document.getElementById("firefly14").style.display = "none";
    document.getElementById("firefly15").style.display = "none";


    if(comand == 0) {
        Core_Env_Updater('brick', false);
        //load splash screen
        //setTimeout(toggleFade, 2000);
        setTimeout(function(){ document.getElementById("ss").style.display = "" }, 1500);
        setTimeout(function(){ document.getElementById("ss").style.display = "none" }, 3500);
        
        setTimeout(function(){ document.getElementById("mm").style.display = "" }, 4500);
        //document.getElementById("ss").style.display = "block";
        //document.body.classList.remove('body_class_main_menu');
        document.body.classList.add('body_class_main_menu');
        trackLogin();
    }

    if(comand == 1) {

        audioEngine.setVolume(0.8);
        audioEngine.loop("dungeonTheme");

        if(player.class != 0) {

            //player has died and is reloading...
            rb_core_score = 0;
            player.hp = class_health[player.class];
            player.dmg = class_damage[player.class];
            player.thp = class_armor[player.class];
            player.arm = class_armor[player.class];
            player.spd_mlt = 1.0; 
            player.lvl = 1;

            floor_number = 1;
            room_number = 0;
            floor_tally = 0;

            player.inv.gold = 0;
		    player.inv.pot_lvl = 0;
		    player.inv.pot_health = 0;
		    player.inv.pot_poison = 0;
		    player.inv.pot_armor = 0;
		    player.inv.pot_damage = 0;
            player.inv.pot_speed = 0;
            player.inv.food = 3;
            player.inv.water = 3;
	
        }
        //load class select
        room_number = 0;
        document.getElementById("cs").style.display = "";
        document.getElementById("stars").style.display = "";
        document.getElementById("stars2").style.display = "";
        document.getElementById("stars3").style.display = "";
        if(is_dev == 0) {
		    renderClassTable();
        } else {
            cheatUnlockAll();
        }
    }

    if(comand == 2) {
        //load dungeon
        if(player.class != 0) {
            document.getElementById("cl_h_tit").innerHTML = "Loading...";
            document.getElementById("cl_p_diag").innerHTML = "Creating your adventure";
            document.getElementById("cl_st_bttn").style.display = "none";
            document.getElementById("cl").style.display = "";
            setTimeout(function(){ document.getElementById("cl_h_tit").innerHTML = "Ready To Embark" }, 4500);
            setTimeout(function(){ document.getElementById("cl_p_diag").innerHTML = "Your adventure awaits!" }, 4500);
            setTimeout(function(){ document.getElementById("cl_st_bttn").style.display = "" }, 4500);
            setTimeout(function(){ triggerNextCard() }, 500);

            var themes = ["rock","forest","snow","desert","mushroom","lava"];

            var tm_sel = Math.floor(Math.random() * themes.length);

            if(tm_sel == 0) {
                Core_Env_Updater('rock', false);
            }

            if(tm_sel == 1) {
                Core_Env_Updater('forest', false);
            }

            if(tm_sel == 2) {
                Core_Env_Updater('snow', false);
            }

            if(tm_sel == 3) {
                Core_Env_Updater('desert', false);
            }

            if(tm_sel == 4) {
                Core_Env_Updater('mushroom', false);
            }

            if(tm_sel == 5) {
                Core_Env_Updater('lava', false);
            }

        } else {
            Engine_Hud(1);
            triggerNextCard();
        }
    }

    if(comand == 3) {
        document.getElementById("tracker").style.display = "";
        document.getElementById("dr").style.display = "";
        Core_Door_Randomizer(0);
        document.getElementById("shrtct").style.display = "";
        
        audioEngine.stop();
        audioEngine.loop("dungeonExplorer");
    }

    if(comand == 4) {
        //Flip a Coin en2
        document.getElementById("tracker").style.display = "";
        document.getElementById("en2").style.display = "";
        Core_Encounter_FAC(0);
    }

    if(comand == 5) {
        //rock paper scissors en1
        document.getElementById("tracker").style.display = "";
        document.getElementById("en1").style.display = "";
        Core_Encounter_RPS(0);
    }

    if(comand == 6) {
        //whack a mole ish en3
        document.getElementById("tracker").style.display = "";
        document.getElementById("en3").style.display = "";
        Core_Encounter_WAM(0);
    }

    if(comand == 7) {
        //plugged drain en4
        document.getElementById("tracker").style.display = "";
        document.getElementById("en4").style.display = "";
        document.getElementById("water_container").style.display = "";
        Core_Encounter_PLG_DR(0);
    }

    if(comand == 8) {
        //plugged MERCHANT
        document.getElementById("tracker").style.display = "";
        document.getElementById("en5").style.display = "";
    }

    if(comand == 9) {
        //plugged HEALING POOL
        document.getElementById("tracker").style.display = "";
        document.getElementById("en6").style.display = "";
        Core_Encounter_HP(0);
    }

    if(comand == 10) {
        //plugged TRAPPED ROOM
        document.getElementById("tracker").style.display = "";
        document.getElementById("en7").style.display = "";
    }

    if(comand == 11) {
        document.getElementById("tracker").style.display = "";
        document.getElementById("bs").style.display = "";
        Core_Engine_Combat(0);
    }

    if(comand == 12) {
        document.getElementById("enout").style.display = "";
        Core_Loot_Randomizer();
    }

    if(comand == 13) {
        document.getElementById("eg").style.display = "";
        Core_Engine_Game_Over(0);
    }

    if(comand == 14) {
        document.getElementById("sc_dr_inv").style.display = "";
        Core_Inventory();
    }

    if(comand == 15) {
        document.getElementById("sc_dr_sts").style.display = "";
    }

    if(comand == 16) {
        document.getElementById("sc_dr_stry").style.display = "";
        render();
    }

    if(comand == 17) {
        document.getElementById("fclr").style.display = "";
        document.getElementById("firefly1").style.display = "";
        document.getElementById("firefly2").style.display = "";
        document.getElementById("firefly3").style.display = "";
        document.getElementById("firefly4").style.display = "";
        document.getElementById("firefly5").style.display = "";
        document.getElementById("firefly6").style.display = "";
        document.getElementById("firefly7").style.display = "";
        document.getElementById("firefly8").style.display = "";
        document.getElementById("firefly9").style.display = "";
        document.getElementById("firefly10").style.display = "";
        document.getElementById("firefly11").style.display = "";
        document.getElementById("firefly12").style.display = "";
        document.getElementById("firefly13").style.display = "";
        document.getElementById("firefly14").style.display = "";
        document.getElementById("firefly15").style.display = "";
    }

    if(comand == 18) {

        if(room_number == 1) {
            document.getElementById("tracker").style.display = "";
            document.getElementById("dr").style.display = "";
            document.getElementById("shrtct").style.display = "";
        } else {
            document.getElementById("tracker").style.display = "";
            document.getElementById("wrld").style.display = "";
            document.getElementById("shrtct").style.display = "";
            world_gen();
        }
        //Core_Door_Randomizer(0);
    }

    if(comand == 19) {
            document.getElementById("tracker").style.display = "";
            document.getElementById("wrld").style.display = "";
            document.getElementById("shrtct").style.display = "";
            world_gen();
    }
}

function Core_Engine_Game_Over(comand) {
    if(comand == 0) {
        document.getElementById("eg").style.display = "block";
        document.getElementById("eg_sc").innerHTML = "You have died in the dungeon...";
    }
}

function toggleAppPopup() {
    document.getElementById('appPopup').classList.toggle('active');
}