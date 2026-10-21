var storyNodes = {
    start: {
        text: "A grumpy blacksmith stands over his anvil. 'What do you want?' he grunts. 'I'm busy, and I lost my favorite wrench.'",
        choices: [
            { text: "Look around the workshop floor.", nextNode: 'findWrench' },
            { 
                text: "Give him his wrench.", 
                nextNode: 'giveWrench', 
                requiredItem: "Wrench"
            },
            { text: "Insult his craftsmanship.", nextNode: 'triggerFight' }
        ]
    },
    findWrench: {
        text: "You rummage through some scrap metal and find a sturdy iron wrench!",
        onEnter: () => { addItem("Wrench"); }, 
        choices: [
            { text: "Turn back to the blacksmith.", nextNode: 'start' }
        ]
    },
    giveWrench: {
        text: "The blacksmith's eyes light up. 'Ah, my wrench! Thank you, kid. Here, take this old dagger for your troubles.'",
        onEnter: () => { 
            removeItem("Wrench"); 
            addItem("Iron Dagger"); 
        },
        choices: [
            { text: "Thank him and leave.", nextNode: 'winScreen' }
        ]
    },
    triggerFight: {
        text: "The blacksmith drops his hammer and raises his fists. 'That's it, you're getting a lesson in manners!'",
        choices: [
            { text: "Put up your guards...", nextNode: 'startCombat' }
        ]
    },
    startCombat: {
        text: "Transitioning to combat...",
        onEnter: () => { startCombatEngine("Blacksmith"); },
        choices: []
    },
    winScreen: {
        text: "You walk away with a shiny new dagger. Adventure successful!",
        choices: [
            { text: "Play again", nextNode: 'resetGame' }
        ]
    },
    resetGame: {
        text: "Resetting...",
        onEnter: () => {
            playerInventory = [];
            updateInventoryDisplay();
            showNode('start');
        },
        choices: []
    },
    GameOver: {
        text: "Resetting...",
        onEnter: () => {
            document.getElementById("sc_story_line").style.display = "none";
            Core_Engine_Game_Over();
        },
        choices: []
    },
    Event_Interview_Intro: {
        text: "You walk up to the table and sit down in the chair. However, the second you sit down you become restrained! A figure appears into view on the other side of the table.",
        choices: [
            { text: "Uh..... Hello?", nextNode: 'Event_Interview_Intro_A' },
            { text: "Oh great, an intervention...", nextNode: 'Event_Interview_Intro_B'},
            { text: "ARE THESE RESTRAINTS NESSECARY?!?!", nextNode: 'Event_Interview_Intro_C'}
        ]
    },

    Event_Interview_Intro_A: {
        text: "Well, well well look what we have here. Fresh meat for my questionaire...",
        choices: [
            { text: "Questionaire?", nextNode: 'Event_Interview_Intro_D' },
            { text: "Um... ok? So im not going to die?", nextNode: 'Event_Interview_Intro_E'}
        ]
    },

    Event_Interview_Intro_B: {
        text: "Well, I wouldn't say an intervention that's a little harsh. More like fresh meat for my questionaire...",
        choices: [
            { text: "Questionaire?", nextNode: 'Event_Interview_Intro_D' },
            { text: "Um... ok? So im not going to die?", nextNode: 'Event_Interview_Intro_E'}
        ]
    },

    Event_Interview_Intro_C: {
        text: "Well, with that attitude absolutely. But also it keeps you here for my questionaire...",
        choices: [
            { text: "Questionaire?", nextNode: 'Event_Interview_Intro_D' },
            { text: "Um... ok? So im not going to die?", nextNode: 'Event_Interview_Intro_E'}
        ]
    },

    Event_Interview_Intro_D: {
        text: "Of course! I haven't seen anyone around here in well over 750 years! You seem like the perfect person to answer them!",
        choices: [
            { text: "Sure, why not...", nextNode: 'Event_Interview_Intro_F' },
            { text: "And if I don't?", nextNode: 'Event_Interview_Intro_G'}
        ]
    },

    Event_Interview_Intro_E: {
        text: "Of course not! consider it extra encouragment to answer my questions...",
        choices: [
            { text: "Sure, why not...", nextNode: 'Event_Interview_Intro_F' },
            { text: "And if I don't?", nextNode: 'Event_Interview_Intro_G'}
        ]
    },

    Event_Interview_Intro_F: {
        text: "Excellent! Whenever you're ready!",
        choices: [
            { text: "I'm Ready!", nextNode: 'Event_Interview_Question_1' }
        ]
    },

    Event_Interview_Intro_G: {
        text: "Well in that case I'll have to kill you...",
        choices: [
            { text: "You literally just said that you wouldn't!?!?!", nextNode: 'Event_Interview_Intro_H' }
        ]
    },

    Event_Interview_Intro_H: {
        text: "Yeah well im a demon what do you expect... So what will it be?",
        choices: [
            { text: "I guess I have little choice...", nextNode: 'Event_Interview_Intro_F' },
            { text: "Yeah no im good", nextNode: 'Event_Interview_Intro_I' }
        ]
    },

    Event_Interview_Intro_I: {
        text: "With a snap of the demons fingers the restraints tighten on you and kill you...",
        choices: [
            { text: "Continue", nextNode: 'GameOver' }
        ]
    },

    Event_Interview_Question_1: {
        text: "Question 1, What is your greatest weakness, and how does it benefit this dungeon?",
        choices: [
            { text: "I like to Smash stuff...", nextNode: '' },
            { text: "I like to Search stuff...", nextNode: ''}
        ]
    },

    Event_Interview_Question_2: {
        text: "Question 2, Why are you trespassing?",
        choices: [
            { text: "I fell down a hole and just wanna find the way out...", nextNode: '' },
            { text: "I fell down a hole and realized how much stuff is down here...", nextNode: ''}
        ]
    },

    Event_Interview_Question_3: {
        text: "Question 3, Where do you see yourself in 500 years?",
        choices: [
            { text: "Dead...", nextNode: '' },
            { text: "Fertilizer for crops...", nextNode: ''},
            { text: "Remembered as a Hero!", nextNode: ''}
        ]
    },

    Encounter_RPS_Intro: {
        text: "",
        choices: [
            { text: "", nextNode: '' },
            { text: "", nextNode: ''}
        ]
    },
};


var playerInventory = [];

function addItem(item) {
    if (!playerInventory.includes(item)) {
        playerInventory.push(item);
        updateInventoryDisplay();
    }
}

function removeItem(item) {
    playerInventory = playerInventory.filter(i => i !== item);
    updateInventoryDisplay();
}

function updateInventoryDisplay() {
    const display = document.getElementById('inventory-display');
    display.innerText = playerInventory.length > 0 
        ? `Inventory: ${playerInventory.join(', ')}` 
        : "Inventory: Empty";
}

function showNode(nodeId) {
    const node = storyNodes[nodeId];
        
    if (node.onEnter) {
        node.onEnter();
        if (nodeId === 'resetGame' || nodeId === 'startCombat') return; 
    }

    document.getElementById('story-text').innerText = node.text;
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';
        
    node.choices.forEach(choice => {
        if (choice.requiredItem && !playerInventory.includes(choice.requiredItem)) {
            return;
        }

        const button = document.createElement('button');
        button.innerText = choice.text;
        button.classList.add('choice-btn');
        button.classList.add('story_board_asset');
        button.onclick = () => showNode(choice.nextNode);
        choicesContainer.appendChild(button);
    });
}

function startCombatEngine(enemyName) {
    console.log(`Combat initiated against: ${enemyName}`);
    alert(`COMBAT HOOK TRIGGERED: You are now fighting ${enemyName}!`);
}