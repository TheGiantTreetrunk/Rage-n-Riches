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
    }
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