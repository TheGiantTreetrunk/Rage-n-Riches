const quests = [
    {
        id: 1,
        title: "The Lumberjack",
        description: "The village needs wood for the winter.",
        targetType: "wood",
        required: 5,
        current: 0,
        reward: 50,
        completed: false
    },
    {
        id: 2,
        title: "Slime Menace",
        description: "Clear out the local slimes.",
        targetType: "slime",
        required: 3,
        current: 0,
        reward: 100,
        completed: false
        }
];

function render() {
    //document.getElementById('player-xp').innerText = rb_core_score;

    const questList = document.getElementById('quest-list');
    questList.innerHTML = '';

    quests.forEach(quest => {
        const questDiv = document.createElement('div');
        questDiv.className = `quest ${quest.completed ? 'completed' : ''}`;
                
        questDiv.innerHTML = `
            <h3>${quest.title} ${quest.completed ? '✅' : ''}</h3>
            <p>${quest.description}</p>
            <span class="progress-text">
                ${quest.completed ? 'DONE' : `Progress: ${quest.current} / ${quest.required}`}
            </span>
        `;
        questList.appendChild(questDiv);
    });
}

function performAction(type) {
    quests.forEach(quest => {
        if (quest.targetType === type && !quest.completed) {
            quest.current++;

            if (quest.current >= quest.required) {
                quest.completed = true;
                rb_core_score += quest.reward;
                console.log(`Finished ${quest.title}! Gained ${quest.reward} XP.`);
            }
        }
    });

    render(); 
}

//render();