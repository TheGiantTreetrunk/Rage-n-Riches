const rb_cr_map_GRID_SIZE = 7;
        const rb_cr_map_CELL_SIZE = 44;
        const rb_cr_map_GRID_GAP = 2; 
        const rb_cr_map_STEP = rb_cr_map_CELL_SIZE + rb_cr_map_GRID_GAP; 
        const rb_cr_map_TOTAL_ROOMS = 6;

        const rb_cr_map_board = document.getElementById('rb_st_map_game_board');
        const rb_cr_map_uiFloor = document.getElementById('ui-floor');
        const rb_cr_map_uiRoom = document.getElementById('ui-room');
        const rb_cr_map_uiScore = document.getElementById('ui-score');
        const rb_cr_map_uiFacing = document.getElementById('ui-facing');

        const rb_cr_map_TORCH_CHAR = 'Z';
        const rb_cr_map_DOOR_CHAR = ':';
        const rb_cr_map_FOUNTAIN_CHAR = 'g';
        const rb_cr_map_WATER_CHAR = 'D';
        const rb_cr_map_GRASS_CHAR = 'o';
        const rb_cr_map_TREE_1_CHAR = 'p';
        const rb_cr_map_TREE_2_CHAR = 'n';
        const rb_cr_map_TREE_3_CHAR = 'l';
        const rb_cr_map_ROCK_CHAR = '*';
        const rb_cr_map_TRAP_CHAR = '^';
        const rb_cr_map_BOSS_CHAR = 'U';
        const rb_cr_map_MERCHANT_CHAR = 'm';

        const rb_cr_map_CRUSH_FLOOR_CHAR = 'O';

        const rb_cr_map_BOOKSHELF_CHAR = 'I';
        const rb_cr_map_BOOKSHELF_KNOCKED_CHAR = 'i';
        const rb_cr_map_WARDROBE_CHAR = 'J';
        const rb_cr_map_WARDROBE_KNOCKED_CHAR = 'j';
        const rb_cr_map_BELLPOST_CHAR = 'P';
        const rb_cr_map_FIREPLACE_CHAR = 'Q';
        const rb_cr_map_CLOSED_DRESSER_CHAR = 'V';
        const rb_cr_map_OPENED_DRESSER_CHAR = 'W';
        const rb_cr_map_VASE_TABLE_CHAR = 'X';
        const rb_cr_map_VASE_TABLE_KNOCKED_CHAR = 'Y';
        const rb_cr_map_CHAIR_CHAR = 't';
        const rb_cr_map_THRONE_CHAR = 'z';

        const rb_cr_map_LAMP_CHAR = 's';
        const rb_cr_map_GLOBE_CHAR = 'u';
        const rb_cr_map_TABLE_CHAR = 'v';
        const rb_cr_map_ALCHEMIST_TABLE_CHAR = 'y';

        const rb_cr_map_CRATE_CHAR = 'r';
        const rb_cr_map_BARREL_CHAR = 'x';
        const rb_cr_map_COBWEB_CHAR = 'w';

        const rb_cr_map_TOILET_CHAR = 'q';

        const rb_cr_map_SHIELD_WALL_CHAR = 'e';
        const rb_cr_map_WINDOW_WALL_CHAR = 'f';
        const rb_cr_map_BANNER_WALL_CHAR = 'h';

        let rb_cr_map_currentFloorNum = 1;
        let rb_cr_map_currentRoomIndex = 0;
        let rb_cr_map_playerScore = 0;
        let rb_cr_map_playerPos = { x: 3, y: 3 };
        let rb_cr_map_playerFacing = 'SOUTH';
        let rb_cr_map_playerElement = null;
        let rb_cr_map_facingIndicatorElement = null;

        let rb_cr_map_merchantCooldown = 0;

        let rb_cr_map_currentFloorRooms = [];
        let rb_cr_map_activeLayout = [];
        let rb_cr_map_itemElements = {};
        let rb_cr_map_doorData = {};
        let rb_cr_map_pathTiles = new Set();

        const rb_cr_map_WALL_DIRS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
        const rb_cr_map_OPPOSITE_WALL = {
            'NORTH': 'SOUTH',
            'SOUTH': 'NORTH',
            'EAST':  'WEST',
            'WEST':  'EAST'
        };

        const rb_cr_map_DIR_OFFSETS = {
            'NORTH': { x: 0, y: -1 },
            'SOUTH': { x: 0, y: 1 },
            'WEST':  { x: -1, y: 0 },
            'EAST':  { x: 1, y: 0 }
        };

        const rb_cr_map_FACING_ARROWS = {
            'NORTH': '▲',
            'SOUTH': '▼',
            'WEST':  '◄',
            'EAST':  '►'
        };

        const rb_cr_map_DOOR_COORDS = {
            'NORTH': { x: 3, y: 0 },
            'SOUTH': { x: 3, y: 6 },
            'WEST':  { x: 0, y: 3 },
            'EAST':  { x: 6, y: 3 }
        };

        const rb_cr_map_ENTRY_SPAWNS = {
            'NORTH': { x: 3, y: 1 },
            'SOUTH': { x: 3, y: 5 },
            'WEST':  { x: 1, y: 3 },
            'EAST':  { x: 5, y: 3 }
        };

        function Core_Map_playBellChime() {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                const ctx = new AudioCtx();
                
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 1.2);

                gain.gain.setValueAtTime(0.5, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start();
                osc.stop(ctx.currentTime + 1.2);
            } catch(e) {}
        }

        function Core_Map_findAssociatedFountain(x, y) {
            const roomItems = rb_cr_map_currentFloorRooms[rb_cr_map_currentRoomIndex].items;
            const item = roomItems[`${x},${y}`];
            if (item && item.fountainKey && roomItems[item.fountainKey]) {
                return { key: item.fountainKey, data: roomItems[item.fountainKey] };
            }
            if (roomItems['3,3'] && roomItems['3,3'].char === rb_cr_map_FOUNTAIN_CHAR) {
                return { key: '3,3', data: roomItems['3,3'] };
            }
            return null;
        }

        function Core_Map_pickLockDoor(doorObj, onComplete) {
            alert("Attempting to pick the lock!");
            doorObj.isLocked = false;
            if (onComplete) onComplete(true);
        }

        function Core_Map_breakDownDoor(doorObj, onComplete) {
            alert("Breaking down the door!");
            doorObj.isLocked = false;
            if (onComplete) onComplete(true);
        }

        function Core_Map_interactWithMerchant(x, y) {
            const options = "Greetings traveler! What would you like to buy?\n\n" +
                            "1 - Health Potion (+50 Score) [Cost: 20 Score]\n" +
                            "2 - Master Lockpick (Unlocks next door) [Cost: 30 Score]\n" +
                            "3 - Decline / Leave";

            const choice = prompt(options, "1");

            if (choice === "1") {
                if (rb_cr_map_playerScore >= 20) {
                    rb_cr_map_playerScore = rb_cr_map_playerScore - 20 + 50;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    alert("You bought a Health Potion!");
                } else {
                    alert("Not enough score points!");
                }
            } else if (choice === "2") {
                if (rb_cr_map_playerScore >= 30) {
                    rb_cr_map_playerScore -= 30;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    alert("You purchased a Master Lockpick!");
                } else {
                    alert("Not enough score points!");
                }
            } else {
                alert("The merchant nods and prepares to pack up.");
            }

            alert("The merchant packs up their wares and vanishes into the dark!");
            const roomItems = rb_cr_map_currentFloorRooms[rb_cr_map_currentRoomIndex].items;
            delete roomItems[`${x},${y}`];
            rb_cr_map_activeLayout[y][x] = ' ';
            Core_Map_renderBoard();
        }

        function Core_Map_interactWithBookshelf(x, y) {
            const roomItems = rb_cr_map_currentFloorRooms[rb_cr_map_currentRoomIndex].items;
            const itemData = roomItems[`${x},${y}`];

            const roll = Math.random();
            if (roll < 0.50) {
                const gold = Math.floor(Math.random() * 30) + 20;
                rb_cr_map_playerScore += gold;
                rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                alert(`You search through the ancient tome bindings and find hidden coin pouch! (+${gold} Score)`);
            } else if (roll < 0.80) {
                alert("You pulled a suspicious lever masked as a book spine! A secret compartment opens (+45 Score)!");
                rb_cr_map_playerScore += 45;
                rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
            } else {
                alert("You inspect the shelf, but it contains only dusty, unreadable manuscripts.");
            }

            rb_cr_map_activeLayout[y][x] = rb_cr_map_BOOKSHELF_KNOCKED_CHAR;
            if (itemData) itemData.char = rb_cr_map_BOOKSHELF_KNOCKED_CHAR;
            Core_Map_renderBoard();
        }

        function Core_Map_triggerChallenge(entityType, itemData, onComplete) {
            if (entityType === 'D') {
                alert("A Demon approaches! Triggering Combat Challenge.");
                if (onComplete) onComplete(true);
            } else if (entityType === 'G') {
                alert("A Ghost appears! Triggering Puzzle Challenge.");
                if (onComplete) onComplete(true);
            } else if (entityType === 'F') {
                if (itemData && itemData.isUsed) {
                    alert("The fountain water is still and depleted.");
                    return;
                }

                const acceptChallenge = confirm("You approach the pool of glowing water in front of the Fountain.\n\nAccept the Sacred Challenge for a blessing?");
                if (acceptChallenge) {
                    alert("Challenge Passed! You drink from the glowing waters and gain +100 points.");
                    rb_cr_map_playerScore += 100;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;

                    if (itemData) {
                        itemData.isUsed = true;
                    }
                    if (onComplete) onComplete(true);
                }
            } else if (entityType === 'U') {
                alert("BOSS BATTLE INITIATED!\n\nYou challenge the Grave Lord in mortal combat!");
                alert("VICTORY! You defeated the Boss and earned +500 points!");
                
                rb_cr_map_playerScore += 500;
                rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;

                if (itemData) itemData.state = 'DESTROYED';
                rb_cr_map_currentFloorRooms[5].bossDefeated = true;

                alert("The dungeon shifts and reshapes around you... Descending to Floor " + (rb_cr_map_currentFloorNum + 1) + "!");
                
                rb_cr_map_currentFloorNum++;
                rb_cr_map_uiFloor.innerText = rb_cr_map_currentFloorNum;
                Core_Map_generateFloorData();
                Core_Map_loadRoom(0);
            }
        }

        function Core_Map_triggerDoorChallenge() {
            const isFight = Math.random() < 0.5;
            if (isFight) {
                alert("Ambush! Enemies attack as you open the door!");
            } else {
                alert("Trap triggered! The room is flooding with water!");
            }
        }

        function Core_Map_handleGrassStep(x, y) {
            if (Math.random() < 0.25) {
                const eventRoll = Math.random();

                if (eventRoll < 0.45) {
                    const entityType = Math.random() < 0.5 ? 'D' : 'G';
                    const name = entityType === 'D' ? 'Demon' : 'Ghost';
                    alert(`AMBUSH! A ${name} leaps out from the tall garden grass!`);
                    Core_Map_triggerChallenge(entityType, null, () => {
                        Core_Map_clearGrassTile(x, y);
                    });
                } else if (eventRoll < 0.70) {
                    alert("SNAP! You stepped on a hidden spike trap concealed in the grass! (-10 Score)");
                    rb_cr_map_playerScore = Math.max(0, rb_cr_map_playerScore - 10);
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    
                    const roomItems = rb_cr_map_currentFloorRooms[rb_cr_map_currentRoomIndex].items;
                    roomItems[`${x},${y}`] = { char: rb_cr_map_TRAP_CHAR, state: 'TRAP' };
                    rb_cr_map_activeLayout[y][x] = rb_cr_map_TRAP_CHAR;
                    Core_Map_renderBoard();
                } else {
                    alert("You rustle through the thick foliage and discover a hidden treasure chest! (+50 Score)");
                    rb_cr_map_playerScore += 50;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    
                    const roomItems = rb_cr_map_currentFloorRooms[rb_cr_map_currentRoomIndex].items;
                    roomItems[`${x},${y}`] = { char: ')', state: 'INTACT' };
                    rb_cr_map_activeLayout[y][x] = ')';
                    Core_Map_renderBoard();
                }
            }
        }

        function Core_Map_clearGrassTile(x, y) {
            const roomItems = rb_cr_map_currentFloorRooms[rb_cr_map_currentRoomIndex].items;
            delete roomItems[`${x},${y}`];
            rb_cr_map_activeLayout[y][x] = ' ';
            Core_Map_renderBoard();
        }

        function Core_Map_generateFloorData() {
            rb_cr_map_currentFloorRooms = [];

            let spawnMerchantThisFloor = false;
            if (rb_cr_map_merchantCooldown > 0) {
                rb_cr_map_merchantCooldown--;
            } else {
                if (Math.random() < 0.60) {
                    spawnMerchantThisFloor = true;
                }
            }

            const merchantRoomIndex = spawnMerchantThisFloor ? Math.floor(Math.random() * 4) + 1 : -1;
            
            const availableSpecialIndices = [1, 2, 3, 4];
            
            const shuffle = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            };
            shuffle(availableSpecialIndices);

            const roomTypePool = ['throne', 'study', 'garden', 'alchemy', 'library', 'storage', 'pond', 'chest', 'toilet'];
            shuffle(roomTypePool);

            const assignedRoomTypes = {};
            for (let i = 0; i < 4; i++) {
                const roomIdx = availableSpecialIndices[i];
                assignedRoomTypes[roomIdx] = roomTypePool[i];
            }

            const firstExit = rb_cr_map_WALL_DIRS[Math.floor(Math.random() * rb_cr_map_WALL_DIRS.length)];
            const r1 = {
                index: 0,
                entryWall: null,
                forwardWall: firstExit,
                doors: {
                    [firstExit]: { type: 'FORWARD', isLocked: false, targetRoom: 1 }
                },
                items: {},
                wallDecorations: Core_Map_generateWallDecorations(null, firstExit)
            };
            r1.pathTiles = Core_Map_generatePathsForRoom(r1.doors);
            rb_cr_map_currentFloorRooms.push(r1);

            for (let i = 1; i < rb_cr_map_TOTAL_ROOMS - 1; i++) {
                const prevRoom = rb_cr_map_currentFloorRooms[i - 1];
                const entryWall = rb_cr_map_OPPOSITE_WALL[prevRoom.forwardWall];
                
                const availableWalls = rb_cr_map_WALL_DIRS.filter(w => w !== entryWall);
                const forwardWall = availableWalls[Math.floor(Math.random() * availableWalls.length)];

                const isLocked = Math.random() < 0.35;

                const roomObj = {
                    index: i,
                    entryWall: entryWall,
                    forwardWall: forwardWall,
                    doors: {
                        [entryWall]: { type: 'BACKWARD', isLocked: false, targetRoom: i - 1 },
                        [forwardWall]: { type: 'FORWARD', isLocked: isLocked, targetRoom: i + 1 }
                    },
                    items: {},
                    wallDecorations: Core_Map_generateWallDecorations(entryWall, forwardWall)
                };

                const hasMerchant = (i === merchantRoomIndex);
                const roomType = assignedRoomTypes[i] || 'standard';

                if (roomType === 'throne') {
                    roomObj.items = Core_Map_generateThroneRoomItems(roomObj, hasMerchant);
                } else if (roomType === 'toilet') {
                    roomObj.items = Core_Map_generateToiletRoomItems(roomObj, hasMerchant);
                } else if (roomType === 'study') {
                    roomObj.items = Core_Map_generatePersonalStudyItems(roomObj, hasMerchant);
                } else if (roomType === 'garden') {
                    roomObj.items = Core_Map_generateGardenItems(roomObj, hasMerchant);
                } else if (roomType === 'alchemy') {
                    roomObj.items = Core_Map_generateAlchemyStudyItems(roomObj, hasMerchant);
                } else if (roomType === 'library') {
                    roomObj.items = Core_Map_generateLibraryItems(roomObj, hasMerchant);
                } else if (roomType === 'storage') {
                    roomObj.items = Core_Map_generateStorageRoomItems(roomObj, hasMerchant);
                } else if (roomType === 'pond') {
                    roomObj.items = Core_Map_generatePondItems(roomObj, hasMerchant);
                } else if (roomType === 'chest') {
                    roomObj.items = Core_Map_generateChestRoomItems(roomObj, hasMerchant);
                } else {
                    roomObj.items = Core_Map_generateRoomItems(roomObj, hasMerchant);
                }

                roomObj.pathTiles = Core_Map_generatePathsForRoom(roomObj.doors);
                rb_cr_map_currentFloorRooms.push(roomObj);
            }

            const prevRoom = rb_cr_map_currentFloorRooms[4];
            const entryWall = rb_cr_map_OPPOSITE_WALL[prevRoom.forwardWall];

            const bossRoomObj = {
                index: 5,
                entryWall: entryWall,
                forwardWall: null,
                bossDefeated: false,
                doors: {
                    [entryWall]: { type: 'BACKWARD', isLocked: false, targetRoom: 4 }
                },
                wallDecorations: Core_Map_generateWallDecorations(entryWall, null),
                items: {
                    '1,1': { char: rb_cr_map_TORCH_CHAR, state: 'INTACT' },
                    '5,1': { char: rb_cr_map_TORCH_CHAR, state: 'INTACT' },
                    '1,5': { char: rb_cr_map_TORCH_CHAR, state: 'INTACT' },
                    '5,5': { char: rb_cr_map_TORCH_CHAR, state: 'INTACT' },
                    '3,3': { char: rb_cr_map_BOSS_CHAR, state: 'ACTIVE' }
                }
            };
            bossRoomObj.pathTiles = Core_Map_generatePathsForRoom(bossRoomObj.doors);
            rb_cr_map_currentFloorRooms.push(bossRoomObj);

            if (spawnMerchantThisFloor) {
                rb_cr_map_merchantCooldown = Math.random() < 0.5 ? 1 : 2;
            }
        }

        function Core_Map_generateGardenItems(roomObj, hasMerchant = false) {
            const items = {};
            const doorClearanceTiles = new Set([
                '3,1', '3,5', '1,3', '5,3',
                '3,2', '3,4', '2,3', '4,3'
            ]);

            const treeTypes = [rb_cr_map_TREE_1_CHAR, rb_cr_map_TREE_2_CHAR, rb_cr_map_TREE_3_CHAR];
            const treeSpots = ['1,1', '5,1', '1,5', '5,5', '2,1', '4,1', '1,2', '5,2'];
            
            treeSpots.forEach(coord => {
                if (!doorClearanceTiles.has(coord) && Math.random() < 0.7) {
                    const tree = treeTypes[Math.floor(Math.random() * treeTypes.length)];
                    items[coord] = { char: tree, state: 'SOLID' };
                }
            });

            const rockSpots = ['2,2', '4,2', '2,4', '4,4', '1,4', '5,4'];
            rockSpots.forEach(coord => {
                if (!doorClearanceTiles.has(coord) && !items[coord] && Math.random() < 0.5) {
                    items[coord] = { char: rb_cr_map_ROCK_CHAR, state: 'INTACT' };
                }
            });

            const grassSpots = [
                '1,3', '2,3', '4,3', '5,3',
                '3,2', '3,4', '2,2', '4,2',
                '2,4', '4,4', '3,3'
            ];

            grassSpots.forEach(coord => {
                if (!doorClearanceTiles.has(coord) && !items[coord] && Math.random() < 0.75) {
                    items[coord] = { char: rb_cr_map_GRASS_CHAR, state: 'WALKABLE' };
                }
            });

            const potentialChestSpots = Object.keys(items).filter(k => items[k].char === rb_cr_map_GRASS_CHAR || items[k].char === rb_cr_map_ROCK_CHAR);
            if (potentialChestSpots.length > 0) {
                const chestCoord = potentialChestSpots[Math.floor(Math.random() * potentialChestSpots.length)];
                items[chestCoord] = { char: '(', state: 'INTACT' };
            } else {
                items['2,2'] = { char: '(', state: 'INTACT' };
            }

            if (hasMerchant) {
                const merchantSpots = ['3,3', '2,3', '4,3'].filter(c => !items[c] && !doorClearanceTiles.has(c));
                if (merchantSpots.length > 0) {
                    items[merchantSpots[0]] = { char: rb_cr_map_MERCHANT_CHAR, state: 'ACTIVE' };
                }
            }

            return items;
        }

        function Core_Map_generateThroneRoomItems(roomObj, hasMerchant = false) {
            const items = {};
            const doorClearanceTiles = new Set([
                '3,1', '3,5', '1,3', '5,3',
                '2,1', '4,1', '2,5', '4,5',
                '1,2', '1,4', '5,2', '5,4'
            ]);

            if (roomObj.entryWall !== 'NORTH' && roomObj.forwardWall !== 'NORTH') {
                items['3,1'] = { char: rb_cr_map_THRONE_CHAR, state: 'INTACT' };
            } else {
                items['3,2'] = { char: rb_cr_map_THRONE_CHAR, state: 'INTACT' };
            }

            const torchCoords = ['2,1', '4,1', '1,1', '5,1'];
            for (const coord of torchCoords) {
                if (!doorClearanceTiles.has(coord) && !items[coord]) {
                    items[coord] = { char: rb_cr_map_TORCH_CHAR, state: 'INTACT' };
                }
            }

            const sideDecorations = ['1,2', '5,2', '1,4', '5,4'];
            for (const coord of sideDecorations) {
                if (!doorClearanceTiles.has(coord) && !items[coord]) {
                    items[coord] = { char: rb_cr_map_VASE_TABLE_CHAR, state: 'INTACT' };
                }
            }

            const chestCoords = ['1,1', '5,1', '1,5', '5,5'];
            for (const coord of chestCoords) {
                if (!doorClearanceTiles.has(coord) && !items[coord]) {
                    items[coord] = { char: '(', state: 'INTACT' };
                }
            }

            if (!items['2,3']) items['2,3'] = { char: rb_cr_map_CHAIR_CHAR, state: 'INTACT' };
            if (!items['4,3']) items['4,3'] = { char: rb_cr_map_CHAIR_CHAR, state: 'INTACT' };

            if (Math.random() < 0.5 && !items['3,3']) {
                items['3,3'] = { char: '?', state: 'ACTIVE' };
            }

            if (hasMerchant) {
                const merchantCandidates = ['1,4', '5,4', '2,4', '4,4', '3,4'].filter(c => !items[c] && !doorClearanceTiles.has(c));
                if (merchantCandidates.length > 0) {
                    items[merchantCandidates[0]] = { char: rb_cr_map_MERCHANT_CHAR, state: 'ACTIVE' };
                }
            }

            return items;
        }

        function Core_Map_generateToiletRoomItems(roomObj, hasMerchant = false) {
            const items = {};
            const doorClearance = new Set(['3,1', '3,5', '1,3', '5,3']);

            const cornerTorches = ['1,1', '5,1', '1,5', '5,5'];
            cornerTorches.forEach(coord => {
                if (!doorClearance.has(coord)) {
                    items[coord] = { char: rb_cr_map_TORCH_CHAR, state: 'INTACT' };
                }
            });

            items['3,3'] = { char: rb_cr_map_TOILET_CHAR, state: 'SOLID' };

            if (!items['1,2']) items['1,2'] = { char: rb_cr_map_COBWEB_CHAR, state: 'INTACT' };
            if (!items['5,2']) items['5,2'] = { char: rb_cr_map_COBWEB_CHAR, state: 'INTACT' };

            if (hasMerchant) {
                const merchantPos = ['2,3', '4,3', '3,2', '3,4'].find(p => !items[p] && !doorClearance.has(p));
                if (merchantPos) {
                    items[merchantPos] = { char: rb_cr_map_MERCHANT_CHAR, state: 'ACTIVE' };
                }
            }

            return items;
        }

        function Core_Map_generatePersonalStudyItems(roomObj, hasMerchant = false) {
            const items = {};
            const doorClearance = new Set(['3,1', '3,5', '1,3', '5,3']);

            const validWalls = ['WEST', 'NORTH', 'EAST'].filter(
                w => w !== roomObj.entryWall && w !== roomObj.forwardWall
            );
            const bookshelfWall = validWalls.length > 0 ? validWalls[0] : 'WEST';

            let bookshelfCoords = [];
            if (bookshelfWall === 'WEST') {
                bookshelfCoords = ['1,1', '1,2', '1,3', '1,4', '1,5'];
            } else if (bookshelfWall === 'NORTH') {
                bookshelfCoords = ['1,1', '2,1', '3,1', '4,1', '5,1'];
            } else if (bookshelfWall === 'EAST') {
                bookshelfCoords = ['5,1', '5,2', '5,3', '5,4', '5,5'];
            }

            bookshelfCoords.forEach(coord => {
                if (!doorClearance.has(coord)) {
                    items[coord] = { char: rb_cr_map_BOOKSHELF_CHAR, state: 'INTACT' };
                }
            });

            const opposingWallMap = {
                'WEST': 'EAST',
                'EAST': 'WEST',
                'NORTH': 'SOUTH',
                'SOUTH': 'NORTH'
            };
            const fireplaceWall = opposingWallMap[bookshelfWall];

            let fireplaceCoord = '5,3';
            if (fireplaceWall === 'EAST') fireplaceCoord = '5,3';
            else if (fireplaceWall === 'WEST') fireplaceCoord = '1,3';
            else if (fireplaceWall === 'SOUTH') fireplaceCoord = '3,5';
            else if (fireplaceWall === 'NORTH') fireplaceCoord = '3,1';

            if (!doorClearance.has(fireplaceCoord) && !items[fireplaceCoord]) {
                items[fireplaceCoord] = { char: rb_cr_map_FIREPLACE_CHAR, state: 'INTACT' };
            } else {
                const fallbackCoords = {
                    'EAST': ['5,2', '5,4'],
                    'WEST': ['1,2', '1,4'],
                    'SOUTH': ['2,5', '4,5'],
                    'NORTH': ['2,1', '4,1']
                };
                for (const coord of fallbackCoords[fireplaceWall]) {
                    if (!doorClearance.has(coord) && !items[coord]) {
                        items[coord] = { char: rb_cr_map_FIREPLACE_CHAR, state: 'INTACT' };
                        break;
                    }
                }
            }

            items['3,3'] = { char: rb_cr_map_CHAIR_CHAR, state: 'INTACT' };
            items['2,3'] = { char: rb_cr_map_LAMP_CHAR, state: 'INTACT' };
            items['4,3'] = { char: rb_cr_map_GLOBE_CHAR, state: 'INTACT' };

            if (hasMerchant) {
                const openPos = ['3,2', '3,4', '2,2', '4,2', '2,4', '4,4'].find(
                    p => !items[p] && !doorClearance.has(p)
                );
                if (openPos) {
                    items[openPos] = { char: rb_cr_map_MERCHANT_CHAR, state: 'ACTIVE' };
                }
            }

            return items;
        }

        function Core_Map_generateChestRoomItems(roomObj, hasMerchant = false) {
            const items = {};
            const doorClearanceTiles = new Set(['3,1', '3,5', '1,3', '5,3']);

            const cornerTorches = ['1,1', '5,1', '1,5', '5,5'];
            for (const coord of cornerTorches) {
                if (!doorClearanceTiles.has(coord)) {
                    items[coord] = { char: rb_cr_map_TORCH_CHAR, state: 'INTACT' };
                }
            }

            const chestCoords = [
                '2,1', '4,1',
                '1,2', '5,2',
                '1,4', '5,4',
                '2,5', '4,5'
            ];

            for (const coord of chestCoords) {
                if (!doorClearanceTiles.has(coord) && Math.random() < 0.75) {
                    items[coord] = { char: '(', state: 'INTACT' };
                }
            }

            if (Math.random() < 0.6) {
                items['3,3'] = { char: '(', state: 'INTACT' };
            } else {
                items['3,3'] = { char: rb_cr_map_VASE_TABLE_CHAR, state: 'INTACT' };
            }

            if (hasMerchant) {
                items['3,2'] = { char: rb_cr_map_MERCHANT_CHAR, state: 'ACTIVE' };
            }

            return items;
        }

        function Core_Map_generatePondItems(roomObj, hasMerchant = false) {
            const items = {};

            for (let x = 2; x <= 4; x++) {
                for (let y = 2; y <= 4; y++) {
                    if (x === 3 && y === 3) continue; 
                    items[`${x},${y}`] = { char: rb_cr_map_WATER_CHAR, state: 'WALKABLE', fountainKey: '3,3' };
                }
            }

            items['3,3'] = { char: rb_cr_map_FOUNTAIN_CHAR, state: 'SOLID', isUsed: false };

            const trapsOnLeft = Math.random() < 0.5;

            for (let y = 1; y <= 5; y++) {
                const leftKey = `1,${y}`;
                if (!['1,3', '3,1', '3,5'].includes(leftKey)) {
                    if (trapsOnLeft) {
                        items[leftKey] = { char: rb_cr_map_TRAP_CHAR, state: 'TRAP' };
                    } else {
                        items[leftKey] = { char: rb_cr_map_GRASS_CHAR, state: 'WALKABLE' };
                    }
                }

                const rightKey = `5,${y}`;
                if (!['5,3', '3,1', '3,5'].includes(rightKey)) {
                    if (!trapsOnLeft) {
                        items[rightKey] = { char: rb_cr_map_TRAP_CHAR, state: 'TRAP' };
                    } else {
                        items[rightKey] = { char: rb_cr_map_GRASS_CHAR, state: 'WALKABLE' };
                    }
                }
            }

            if (hasMerchant) {
                const mPos = trapsOnLeft ? '5,1' : '1,1';
                items[mPos] = { char: rb_cr_map_MERCHANT_CHAR, state: 'ACTIVE' };
            }

            return items;
        }

        function Core_Map_generateAlchemyStudyItems(roomObj, hasMerchant = false) {
            const items = {};
            const doorClearance = new Set(['3,1', '3,5', '1,3', '5,3']);

            items['3,3'] = { char: rb_cr_map_ALCHEMIST_TABLE_CHAR, state: 'INTACT' };

            const barrelSpots = ['2,2', '4,2', '2,4', '4,4', '2,3', '4,3'];
            barrelSpots.forEach(coord => {
                if (!doorClearance.has(coord) && Math.random() < 0.75) {
                    items[coord] = { char: rb_cr_map_BARREL_CHAR, state: 'INTACT' };
                }
            });

            const wallSpots = ['1,1', '2,1', '4,1', '5,1', '1,5', '5,5'];
            wallSpots.forEach(coord => {
                if (!doorClearance.has(coord)) {
                    const roll = Math.random();
                    if (roll < 0.5) {
                        items[coord] = { char: rb_cr_map_BOOKSHELF_CHAR, state: 'INTACT' };
                    } else if (roll < 0.8) {
                        items[coord] = { char: rb_cr_map_COBWEB_CHAR, state: 'INTACT' };
                    }
                }
            });

            items['1,2'] = { char: rb_cr_map_LAMP_CHAR, state: 'INTACT' };
            items['5,2'] = { char: rb_cr_map_LAMP_CHAR, state: 'INTACT' };
            if (!items['3,2'] && !doorClearance.has('3,2')) {
                items['3,2'] = { char: '<', state: 'INTACT' };
            }

            if (hasMerchant) {
                const merchantPos = ['1,4', '5,4', '3,4'].find(p => !items[p] && !doorClearance.has(p));
                if (merchantPos) {
                    items[merchantPos] = { char: rb_cr_map_MERCHANT_CHAR, state: 'ACTIVE' };
                }
            }

            return items;
        }

        function Core_Map_generateLibraryItems(roomObj, hasMerchant = false) {
            const items = {};
            const doorClearance = new Set(['3,1', '3,5', '1,3', '5,3']);

            const wallsToLine = rb_cr_map_WALL_DIRS.filter(w => w !== roomObj.entryWall && w !== roomObj.forwardWall);
            
            wallsToLine.forEach(wall => {
                let coords = [];
                if (wall === 'NORTH') coords = ['1,1', '2,1', '3,1', '4,1', '5,1'];
                else if (wall === 'SOUTH') coords = ['1,5', '2,5', '3,5', '4,5', '5,5'];
                else if (wall === 'WEST') coords = ['1,1', '1,2', '1,3', '1,4', '1,5'];
                else if (wall === 'EAST') coords = ['5,1', '5,2', '5,3', '5,4', '5,5'];

                coords.forEach(coord => {
                    if (!doorClearance.has(coord)) {
                        items[coord] = { char: rb_cr_map_BOOKSHELF_CHAR, state: 'INTACT' };
                    }
                });
            });

            items['3,3'] = { char: rb_cr_map_TABLE_CHAR, state: 'INTACT' };
            items['3,4'] = { char: rb_cr_map_CHAIR_CHAR, state: 'INTACT' };

            const featurePositions = ['2,3', '4,3', '3,2', '2,2', '4,2'];
            const features = [rb_cr_map_GLOBE_CHAR, rb_cr_map_LAMP_CHAR, rb_cr_map_ALCHEMIST_TABLE_CHAR];
            
            features.forEach(featChar => {
                const openPos = featurePositions.find(p => !items[p] && !doorClearance.has(p));
                if (openPos) {
                    items[openPos] = { char: featChar, state: 'INTACT' };
                }
            });

            const corners = ['1,1', '5,1', '1,5', '5,5'];
            corners.forEach(corner => {
                if (!items[corner] && !doorClearance.has(corner)) {
                    items[corner] = { char: rb_cr_map_LAMP_CHAR, state: 'INTACT' };
                }
            });

            if (hasMerchant) {
                const merchantPos = ['2,4', '4,4', '2,2', '4,2'].find(p => !items[p] && !doorClearance.has(p));
                if (merchantPos) {
                    items[merchantPos] = { char: rb_cr_map_MERCHANT_CHAR, state: 'ACTIVE' };
                }
            }

            return items;
        }

        function Core_Map_generateStorageRoomItems(roomObj, hasMerchant = false) {
            const items = {};
            const doorClearance = new Set(['3,1', '3,5', '1,3', '5,3']);

            const wallCoords = [
                '1,1', '2,1', '4,1', '5,1',
                '1,2', '5,2',
                '1,4', '5,4',
                '1,5', '2,5', '4,5', '5,5'
            ];

            wallCoords.forEach(coord => {
                if (doorClearance.has(coord)) return;

                const roll = Math.random();
                if (roll < 0.35) {
                    items[coord] = { char: rb_cr_map_CRATE_CHAR, state: 'INTACT' };
                } else if (roll < 0.60) {
                    items[coord] = { char: rb_cr_map_BARREL_CHAR, state: 'INTACT' };
                } else if (roll < 0.80) {
                    items[coord] = { char: rb_cr_map_COBWEB_CHAR, state: 'INTACT' };
                }
            });

            const dungeonSurplusPalette = [
                rb_cr_map_BOOKSHELF_CHAR, rb_cr_map_WARDROBE_CHAR, rb_cr_map_CLOSED_DRESSER_CHAR, 
                rb_cr_map_VASE_TABLE_CHAR, rb_cr_map_CHAIR_CHAR, rb_cr_map_LAMP_CHAR, rb_cr_map_GLOBE_CHAR, 
                rb_cr_map_TABLE_CHAR, rb_cr_map_ALCHEMIST_TABLE_CHAR, rb_cr_map_TORCH_CHAR, 
                rb_cr_map_BELLPOST_CHAR, rb_cr_map_ROCK_CHAR, '(', rb_cr_map_BARREL_CHAR
            ];

            const innerSpots = ['2,2', '3,2', '4,2', '2,3', '4,3', '2,4', '3,4', '4,4'];
            const surplusCount = Math.floor(Math.random() * 3) + 3;

            for (let i = 0; i < surplusCount; i++) {
                const candidateSpots = innerSpots.filter(p => !items[p] && !doorClearance.has(p));
                if (candidateSpots.length === 0) break;

                const chosenCoord = candidateSpots[Math.floor(Math.random() * candidateSpots.length)];
                const randomItemChar = dungeonSurplusPalette[Math.floor(Math.random() * dungeonSurplusPalette.length)];

                items[chosenCoord] = { char: randomItemChar, state: 'INTACT' };
            }

            if (!items['3,3'] && !doorClearance.has('3,3')) {
                items['3,3'] = { char: rb_cr_map_CRATE_CHAR, state: 'INTACT' };
            }

            if (hasMerchant) {
                const openMerchantPos = ['2,3', '4,3', '3,2', '3,4'].find(p => !items[p] && !doorClearance.has(p));
                if (openMerchantPos) {
                    items[openMerchantPos] = { char: rb_cr_map_MERCHANT_CHAR, state: 'ACTIVE' };
                }
            }

            return items;
        }

        function Core_Map_generateWallDecorations(entryWall, forwardWall) {
            const wallItems = {};
            const availableDecorations = [rb_cr_map_SHIELD_WALL_CHAR, rb_cr_map_WINDOW_WALL_CHAR, rb_cr_map_BANNER_WALL_CHAR];

            const activeWalls = new Set();
            if (entryWall) activeWalls.add(entryWall);
            if (forwardWall) activeWalls.add(forwardWall);

            for (const wall of rb_cr_map_WALL_DIRS) {
                if (activeWalls.has(wall)) continue;

                if (Math.random() < 0.6) {
                    const decChar = availableDecorations[Math.floor(Math.random() * availableDecorations.length)];
                    let coord = { x: 3, y: 3 };
                    if (wall === 'NORTH') coord = { x: 3, y: 0 };
                    else if (wall === 'SOUTH') coord = { x: 3, y: 6 };
                    else if (wall === 'WEST') coord = { x: 0, y: 3 };
                    else if (wall === 'EAST') coord = { x: 6, y: 3 };

                    wallItems[`${coord.x},${coord.y}`] = decChar;
                }
            }
            return wallItems;
        }

        function Core_Map_generatePathsForRoom(doors) {
            const pathSet = new Set();
            if (!doors || Math.random() < 0.3) return pathSet;

            const activeDoorWalls = Object.keys(doors);
            if (activeDoorWalls.length < 2) return pathSet;

            const startPt = rb_cr_map_ENTRY_SPAWNS[activeDoorWalls[0]];
            const endPt = rb_cr_map_ENTRY_SPAWNS[activeDoorWalls[1]];

            let currX = startPt.x;
            let currY = startPt.y;

            pathSet.add(`${currX},${currY}`);

            while (currX !== endPt.x || currY !== endPt.y) {
                if (Math.random() < 0.5 && currX !== endPt.x) {
                    currX += (endPt.x > currX ? 1 : -1);
                } else if (currY !== endPt.y) {
                    currY += (endPt.y > currY ? 1 : -1);
                } else {
                    currX += (endPt.x > currX ? 1 : -1);
                }
                pathSet.add(`${currX},${currY}`);
            }

            return pathSet;
        }

        function Core_Map_generateRoomItems(roomObj, hasMerchant = false) {
            let items = {};
            let isValidLayout = false;
            let attempts = 0;

            const doorClearanceTiles = new Set([
                '3,1', '2,1', '4,1',
                '3,5', '2,5', '4,5',
                '1,3', '1,2', '1,4',
                '5,3', '5,2', '5,4'
            ]);

            while (!isValidLayout && attempts < 50) {
                attempts++;
                items = {};

                if (hasMerchant) {
                    let mx = Math.floor(Math.random() * 3) + 2;
                    let my = Math.floor(Math.random() * 3) + 2;
                    let key = `${mx},${my}`;
                    if (!doorClearanceTiles.has(key)) {
                        items[key] = { char: rb_cr_map_MERCHANT_CHAR, state: 'ACTIVE' };
                    }
                }

                if (Math.random() < 0.5) {
                    const fKey = '3,3';
                    if (!items[fKey]) {
                        items[fKey] = { char: rb_cr_map_FOUNTAIN_CHAR, state: 'SOLID', isUsed: false };

                        for (let x = 2; x <= 4; x++) {
                            for (let y = 2; y <= 4; y++) {
                                if (x === 3 && y === 3) continue;
                                const wKey = `${x},${y}`;
                                if (!items[wKey]) items[wKey] = { char: rb_cr_map_WATER_CHAR, state: 'WALKABLE', fountainKey: fKey };
                            }
                        }
                    }
                }

                if (Math.random() < 0.4) {
                    const isHorizontal = Math.random() < 0.5;
                    if (isHorizontal) {
                        const trapY = Math.random() < 0.5 ? 2 : 4;
                        for (let tx = 1; tx <= 5; tx++) {
                            const key = `${tx},${trapY}`;
                            if (!items[key]) {
                                items[key] = { char: rb_cr_map_TRAP_CHAR, state: 'TRAP' };
                            }
                        }
                    } else {
                        const trapX = Math.random() < 0.5 ? 2 : 4;
                        for (let ty = 1; ty <= 5; ty++) {
                            const key = `${trapX},${ty}`;
                            if (!items[key]) {
                                items[key] = { char: rb_cr_map_TRAP_CHAR, state: 'TRAP' };
                            }
                        }
                    }
                }

                const grassTypeRoll = Math.random();
                let grassCount = grassTypeRoll < 0.25 ? Math.floor(Math.random() * 6) + 12 : (grassTypeRoll < 0.75 ? Math.floor(Math.random() * 5) + 6 : Math.floor(Math.random() * 3) + 2);

                let gx = Math.floor(Math.random() * 5) + 1;
                let gy = Math.floor(Math.random() * 5) + 1;

                for (let g = 0; g < grassCount; g++) {
                    const key = `${gx},${gy}`;
                    if (!doorClearanceTiles.has(key) && !items[key]) {
                        items[key] = { char: rb_cr_map_GRASS_CHAR, state: 'WALKABLE' };
                    }
                    gx = Math.min(5, Math.max(1, gx + (Math.floor(Math.random() * 3) - 1)));
                    gy = Math.min(5, Math.max(1, gy + (Math.floor(Math.random() * 3) - 1)));
                }

                const possibleItems = [
                    '(', '<', rb_cr_map_ROCK_CHAR, rb_cr_map_TORCH_CHAR, 
                    rb_cr_map_WARDROBE_CHAR, rb_cr_map_BELLPOST_CHAR, 
                    rb_cr_map_FIREPLACE_CHAR, rb_cr_map_CLOSED_DRESSER_CHAR, rb_cr_map_VASE_TABLE_CHAR,
                    rb_cr_map_LAMP_CHAR, rb_cr_map_GLOBE_CHAR, rb_cr_map_TABLE_CHAR, rb_cr_map_ALCHEMIST_TABLE_CHAR,
                    rb_cr_map_CRATE_CHAR, rb_cr_map_BARREL_CHAR, rb_cr_map_COBWEB_CHAR
                ];
                const itemCount = Math.floor(Math.random() * 4) + 2;

                for (let i = 0; i < itemCount; i++) {
                    const rx = Math.floor(Math.random() * 5) + 1;
                    const ry = Math.floor(Math.random() * 5) + 1;
                    const key = `${rx},${ry}`;

                    if (doorClearanceTiles.has(key) || items[key]) continue;

                    const char = possibleItems[Math.floor(Math.random() * possibleItems.length)];
                    items[key] = { char: char, state: 'INTACT' };
                }

                if (Math.random() < 0.5) {
                    const cx = Math.floor(Math.random() * 3) + 2;
                    const cy = Math.floor(Math.random() * 3) + 2;
                    const key = `${cx},${cy}`;

                    if (!doorClearanceTiles.has(key) && !items[key]) {
                        const entityChar = Math.random() < 0.5 ? '?' : '&';
                        items[key] = { char: entityChar, state: 'ACTIVE' };
                    }
                }

                isValidLayout = Core_Map_validateRoomPathways(items, roomObj);
            }

            return items;
        }

        function Core_Map_validateRoomPathways(items, roomObj) {
            if (!roomObj || !roomObj.doors) return true;

            const activeSpawnPoints = [];
            for (const wall of Object.keys(roomObj.doors)) {
                activeSpawnPoints.push(rb_cr_map_ENTRY_SPAWNS[wall]);
            }

            if (activeSpawnPoints.length < 2) return true;

            const start = activeSpawnPoints[0];
            const queue = [start];
            const visited = new Set([`${start.x},${start.y}`]);

            while (queue.length > 0) {
                const curr = queue.shift();

                const neighbors = [
                    { x: curr.x, y: curr.y - 1 },
                    { x: curr.x, y: curr.y + 1 },
                    { x: curr.x - 1, y: curr.y },
                    { x: curr.x + 1, y: curr.y }
                ];

                for (const n of neighbors) {
                    if (n.x < 1 || n.x > 5 || n.y < 1 || n.y > 5) continue;
                    
                    const key = `${n.x},${n.y}`;
                    if (visited.has(key)) continue;

                    const item = items[key];
                    if (item && (
                        item.state === 'SOLID' || 
                        item.state === 'INTACT' || 
                        item.state === 'ACTIVE' || 
                        item.char === rb_cr_map_MERCHANT_CHAR || 
                        item.char === rb_cr_map_BOOKSHELF_CHAR || 
                        item.char === rb_cr_map_CHAIR_CHAR || 
                        item.char === rb_cr_map_THRONE_CHAR ||
                        item.char === rb_cr_map_TABLE_CHAR ||
                        item.char === rb_cr_map_ALCHEMIST_TABLE_CHAR ||
                        item.char === rb_cr_map_GLOBE_CHAR ||
                        item.char === rb_cr_map_LAMP_CHAR ||
                        item.char === rb_cr_map_CRATE_CHAR ||
                        item.char === rb_cr_map_BARREL_CHAR ||
                        item.char === rb_cr_map_TREE_1_CHAR ||
                        item.char === rb_cr_map_TREE_2_CHAR ||
                        item.char === rb_cr_map_TREE_3_CHAR ||
                        item.char === rb_cr_map_TOILET_CHAR
                    )) continue;

                    visited.add(key);
                    queue.push(n);
                }
            }

            return activeSpawnPoints.every(pt => visited.has(`${pt.x},${pt.y}`));
        }

        function Core_Map_loadRoom(roomIdx, entryDirection = null) {
            rb_cr_map_currentRoomIndex = roomIdx;
            rb_cr_map_uiRoom.innerText = `${rb_cr_map_currentRoomIndex + 1} / ${rb_cr_map_TOTAL_ROOMS}`;

            const roomData = rb_cr_map_currentFloorRooms[roomIdx];
            rb_cr_map_doorData = roomData.doors;
            rb_cr_map_pathTiles = roomData.pathTiles || new Set();

            rb_cr_map_activeLayout = Array(rb_cr_map_GRID_SIZE).fill(null).map(() => Array(rb_cr_map_GRID_SIZE).fill(' '));

            for (let r = 0; r < rb_cr_map_GRID_SIZE; r++) {
                for (let c = 0; c < rb_cr_map_GRID_SIZE; c++) {
                    if (r === 0 || r === rb_cr_map_GRID_SIZE - 1 || c === 0 || c === rb_cr_map_GRID_SIZE - 1) {
                        rb_cr_map_activeLayout[r][c] = 'W';
                    }
                }
            }

            for (const [wall, dInfo] of Object.entries(rb_cr_map_doorData)) {
                const coord = rb_cr_map_DOOR_COORDS[wall];
                rb_cr_map_activeLayout[coord.y][coord.x] = rb_cr_map_DOOR_CHAR;
            }

            for (const [posKey, item] of Object.entries(roomData.items)) {
                if (!item) continue;
                const [ix, iy] = posKey.split(',').map(Number);
                if (item.state !== 'DESTROYED') {
                    rb_cr_map_activeLayout[iy][ix] = item.char;
                }
            }

            if (entryDirection && rb_cr_map_ENTRY_SPAWNS[entryDirection]) {
                rb_cr_map_playerPos = { ...rb_cr_map_ENTRY_SPAWNS[entryDirection] };
                rb_cr_map_playerFacing = rb_cr_map_OPPOSITE_WALL[entryDirection];
            } else {
                rb_cr_map_playerPos = { x: 3, y: 3 };
                rb_cr_map_playerFacing = 'SOUTH';
            }

            Core_Map_renderBoard();
        }

        function Core_Map_renderBoard() {
            rb_cr_map_board.innerHTML = '';
            rb_cr_map_itemElements = {};

            for (let r = 0; r < rb_cr_map_GRID_SIZE; r++) {
                for (let c = 0; c < rb_cr_map_GRID_SIZE; c++) {
                    const tile = document.createElement('div');
                    tile.classList.add('rb_st_map_tile');
                    
                    const glyph = document.createElement('span');
                    glyph.classList.add('rb_st_map_tile_glyph');

                    const isWallBoundary = (r === 0 || r === rb_cr_map_GRID_SIZE - 1 || c === 0 || c === rb_cr_map_GRID_SIZE - 1);
                    const charAt = rb_cr_map_activeLayout[r][c];

                    if (isWallBoundary) {
                        glyph.innerText = ' ';
                        glyph.classList.add('rb_st_map_tile_wall');
                    } else {
                        if (charAt === rb_cr_map_WATER_CHAR) {
                            glyph.innerText = rb_cr_map_WATER_CHAR;
                            glyph.classList.add('rb_st_map_tile_water');
                        } else if (rb_cr_map_pathTiles.has(`${c},${r}`)) {
                            glyph.innerText = rb_cr_map_CRUSH_FLOOR_CHAR;
                            glyph.classList.add('rb_st_map_tile_cracked');
                        } else {
                            glyph.innerText = '#';
                        }
                    }
                    
                    tile.appendChild(glyph);
                    rb_cr_map_board.appendChild(tile);
                }
            }

            for (let r = 0; r < rb_cr_map_GRID_SIZE; r++) {
                for (let c = 0; c < rb_cr_map_GRID_SIZE; c++) {
                    const char = rb_cr_map_activeLayout[r][c];

                    if (char === rb_cr_map_DOOR_CHAR) {
                        Core_Map_spawnDoor(c, r);
                    } else if (char !== ' ' && char !== 'W' && char !== rb_cr_map_WATER_CHAR) {
                        Core_Map_spawnItem(c, r, char);
                    }
                }
            }

            const roomData = rb_cr_map_currentFloorRooms[rb_cr_map_currentRoomIndex];
            if (roomData && roomData.wallDecorations) {
                for (const [posKey, char] of Object.entries(roomData.wallDecorations)) {
                    const [x, y] = posKey.split(',').map(Number);
                    Core_Map_spawnWallDecoration(x, y, char);
                }
            }

            Core_Map_spawnPlayer();
        }

        function Core_Map_spawnDoor(x, y) {
            const doorNode = document.createElement('div');
            doorNode.classList.add('rb_st_map_door_node');
            doorNode.style.transform = `translate(${x * rb_cr_map_STEP}px, ${y * rb_cr_map_STEP}px)`;

            const doorText = document.createElement('div');
            doorText.classList.add('rb_st_map_door_text');

            let wallKey = null;
            if (y === 0) { doorText.classList.add('rb_st_map_door_north'); wallKey = 'NORTH'; }
            else if (y === rb_cr_map_GRID_SIZE - 1) { doorText.classList.add('rb_st_map_door_south'); wallKey = 'SOUTH'; }
            else if (x === 0) { doorText.classList.add('rb_st_map_door_west'); wallKey = 'WEST'; }
            else if (x === rb_cr_map_GRID_SIZE - 1) { doorText.classList.add('rb_st_map_door_east'); wallKey = 'EAST'; }

            const dObj = rb_cr_map_doorData[wallKey];
            if (dObj && dObj.isLocked) {
                doorText.classList.add('rb_st_map_door_locked');
            }

            doorText.innerText = rb_cr_map_DOOR_CHAR;
            doorNode.appendChild(doorText);
            rb_cr_map_board.appendChild(doorNode);
        }

        function Core_Map_spawnWallDecoration(x, y, char) {
            const wallDecNode = document.createElement('div');
            wallDecNode.classList.add('rb_st_map_wall_dec_node');
            wallDecNode.style.transform = `translate(${x * rb_cr_map_STEP}px, ${y * rb_cr_map_STEP}px)`;

            const wallDecText = document.createElement('div');
            wallDecText.classList.add('rb_st_map_wall_dec_text');

            if (y === 0) { wallDecText.classList.add('rb_st_map_wall_dec_north'); }
            else if (y === rb_cr_map_GRID_SIZE - 1) { wallDecText.classList.add('rb_st_map_wall_dec_south'); }
            else if (x === 0) { wallDecText.classList.add('rb_st_map_wall_dec_west'); }
            else if (x === rb_cr_map_GRID_SIZE - 1) { wallDecText.classList.add('rb_st_map_wall_dec_east'); }

            wallDecText.innerText = char;
            wallDecNode.appendChild(wallDecText);
            rb_cr_map_board.appendChild(wallDecNode);
        }

        function Core_Map_spawnItem(x, y, char) {
            const itemNode = document.createElement('div');
            itemNode.classList.add('rb_st_map_item_node');
            itemNode.style.transform = `translate(${x * rb_cr_map_STEP}px, ${y * rb_cr_map_STEP}px)`;

            const itemText = document.createElement('div');
            itemText.classList.add('rb_st_map_item_text');
            itemText.innerText = char;

            const roomItems = rb_cr_map_currentFloorRooms[rb_cr_map_currentRoomIndex].items;
            const itemData = roomItems[`${x},${y}`];

            if (char === '(' || char === ')') itemText.classList.add('rb_st_map_item_chest');
            else if (char === '<') itemText.classList.add('rb_st_map_item_vase');
            else if (char === rb_cr_map_TORCH_CHAR) itemText.classList.add('rb_st_map_item_torch');
            else if (char === rb_cr_map_ROCK_CHAR) itemText.classList.add('rb_st_map_item_rock');
            else if (char === rb_cr_map_TREE_1_CHAR || char === rb_cr_map_TREE_2_CHAR || char === rb_cr_map_TREE_3_CHAR) itemText.classList.add('rb_st_map_item_tree');
            else if (char === '?') itemText.classList.add('rb_st_map_item_demon');
            else if (char === '&') itemText.classList.add('rb_st_map_item_ghost');
            else if (char === rb_cr_map_BOSS_CHAR) itemText.classList.add('rb_st_map_item_boss');
            else if (char === rb_cr_map_MERCHANT_CHAR) itemText.classList.add('rb_st_map_item_merchant');
            else if (char === rb_cr_map_BOOKSHELF_CHAR) itemText.classList.add('rb_st_map_item_bookshelf');
            else if (char === rb_cr_map_BOOKSHELF_KNOCKED_CHAR) itemText.classList.add('rb_st_map_item_bookshelf', 'rb_st_map_item_knocked');
            else if (char === rb_cr_map_WARDROBE_CHAR) itemText.classList.add('rb_st_map_item_wardrobe');
            else if (char === rb_cr_map_WARDROBE_KNOCKED_CHAR) itemText.classList.add('rb_st_map_item_wardrobe', 'rb_st_map_item_knocked');
            else if (char === rb_cr_map_BELLPOST_CHAR) itemText.classList.add('rb_st_map_item_bellpost');
            else if (char === rb_cr_map_FIREPLACE_CHAR) itemText.classList.add('rb_st_map_item_fireplace');
            else if (char === rb_cr_map_CLOSED_DRESSER_CHAR || char === rb_cr_map_OPENED_DRESSER_CHAR) itemText.classList.add('rb_st_map_item_dresser');
            else if (char === rb_cr_map_VASE_TABLE_CHAR) itemText.classList.add('rb_st_map_item_table_vase');
            else if (char === rb_cr_map_VASE_TABLE_KNOCKED_CHAR) itemText.classList.add('rb_st_map_item_table_vase', 'rb_st_map_item_knocked');
            else if (char === rb_cr_map_CHAIR_CHAR) itemText.classList.add('rb_st_map_item_chair');
            else if (char === rb_cr_map_THRONE_CHAR) itemText.classList.add('rb_st_map_item_throne');
            else if (char === rb_cr_map_LAMP_CHAR) itemText.classList.add('rb_st_map_item_lamp');
            else if (char === rb_cr_map_GLOBE_CHAR) itemText.classList.add('rb_st_map_item_globe');
            else if (char === rb_cr_map_TABLE_CHAR) itemText.classList.add('rb_st_map_item_table');
            else if (char === rb_cr_map_ALCHEMIST_TABLE_CHAR) itemText.classList.add('rb_st_map_item_alchemist_table');
            else if (char === rb_cr_map_CRATE_CHAR) itemText.classList.add('rb_st_map_item_crate');
            else if (char === rb_cr_map_BARREL_CHAR) itemText.classList.add('rb_st_map_item_barrel');
            else if (char === rb_cr_map_COBWEB_CHAR) itemText.classList.add('rb_st_map_item_cobweb');
            else if (char === rb_cr_map_TOILET_CHAR) itemText.classList.add('rb_st_map_item_toilet');
            else if (char === rb_cr_map_FOUNTAIN_CHAR) {
                if (itemData && itemData.isUsed) {
                    itemText.classList.add('rb_st_map_item_fountain_used');
                } else {
                    itemText.classList.add('rb_st_map_item_fountain');
                }
            }
            else if (char === rb_cr_map_GRASS_CHAR) itemText.classList.add('rb_st_map_item_grass');
            else if (char === rb_cr_map_TRAP_CHAR) itemText.classList.add('rb_st_map_item_trap');

            itemNode.appendChild(itemText);
            rb_cr_map_board.appendChild(itemNode);

            rb_cr_map_itemElements[`${x},${y}`] = itemText;
        }

        function Core_Map_spawnPlayer() {
            rb_cr_map_playerElement = document.createElement('div');
            rb_cr_map_playerElement.id = 'rb_st_map_player';

            const wrapper = document.createElement('div');
            wrapper.classList.add('rb_st_map_player_wrapper');

            const sprite = document.createElement('div');
            sprite.classList.add('rb_st_map_player_text');
            sprite.innerText = '@';

            rb_cr_map_facingIndicatorElement = document.createElement('div');
            rb_cr_map_facingIndicatorElement.classList.add('rb_st_map_facing_indicator');

            wrapper.appendChild(sprite);
            wrapper.appendChild(rb_cr_map_facingIndicatorElement);
            rb_cr_map_playerElement.appendChild(wrapper);
            rb_cr_map_board.appendChild(rb_cr_map_playerElement);

            Core_Map_updatePlayerRender();
        }

        function Core_Map_updatePlayerRender() {
            rb_cr_map_playerElement.style.transform = `translate(${rb_cr_map_playerPos.x * rb_cr_map_STEP}px, ${rb_cr_map_playerPos.y * rb_cr_map_STEP}px)`;
            rb_cr_map_facingIndicatorElement.innerText = rb_cr_map_FACING_ARROWS[rb_cr_map_playerFacing];
            rb_cr_map_uiFacing.innerText = rb_cr_map_playerFacing;
        }

        function Core_Map_isWalkable(x, y) {
            if (x < 0 || x >= rb_cr_map_GRID_SIZE || y < 0 || y >= rb_cr_map_GRID_SIZE) return false;

            const char = rb_cr_map_activeLayout[y][x];
            if (char === 'W') return false;

            if ([
                '(', '<', rb_cr_map_ROCK_CHAR, rb_cr_map_TREE_1_CHAR, rb_cr_map_TREE_2_CHAR, rb_cr_map_TREE_3_CHAR, rb_cr_map_TORCH_CHAR, '?', '&', rb_cr_map_BOSS_CHAR, rb_cr_map_MERCHANT_CHAR, rb_cr_map_TRAP_CHAR,
                rb_cr_map_BOOKSHELF_CHAR, rb_cr_map_WARDROBE_CHAR, rb_cr_map_BELLPOST_CHAR, rb_cr_map_FIREPLACE_CHAR, rb_cr_map_CLOSED_DRESSER_CHAR, rb_cr_map_VASE_TABLE_CHAR, rb_cr_map_CHAIR_CHAR, rb_cr_map_THRONE_CHAR,
                rb_cr_map_LAMP_CHAR, rb_cr_map_GLOBE_CHAR, rb_cr_map_TABLE_CHAR, rb_cr_map_ALCHEMIST_TABLE_CHAR, rb_cr_map_CRATE_CHAR, rb_cr_map_BARREL_CHAR, rb_cr_map_FOUNTAIN_CHAR, rb_cr_map_TOILET_CHAR
            ].includes(char)) return false;

            return true;
        }

        function Core_Map_movePlayer(dx, dy, newFacing) {
            rb_cr_map_playerFacing = newFacing;

            const targetX = rb_cr_map_playerPos.x + dx;
            const targetY = rb_cr_map_playerPos.y + dy;

            if (Core_Map_isWalkable(targetX, targetY)) {
                rb_cr_map_playerPos.x = targetX;
                rb_cr_map_playerPos.y = targetY;

                const tileChar = rb_cr_map_activeLayout[targetY][targetX];

                if (tileChar === rb_cr_map_DOOR_CHAR) {
                    Core_Map_handleDoorStep(targetX, targetY);
                } else if (tileChar === rb_cr_map_GRASS_CHAR) {
                    Core_Map_handleGrassStep(targetX, targetY);
                }
            }

            Core_Map_updatePlayerRender();
        }

        function Core_Map_handleDoorStep(x, y) {
            let wallKey = null;
            if (y === 0) wallKey = 'NORTH';
            else if (y === rb_cr_map_GRID_SIZE - 1) wallKey = 'SOUTH';
            else if (x === 0) wallKey = 'WEST';
            else if (x === rb_cr_map_GRID_SIZE - 1) wallKey = 'EAST';

            const doorObj = rb_cr_map_doorData[wallKey];
            if (!doorObj) return;

            if (doorObj.isLocked) {
                rb_cr_map_playerPos.x -= (x === 0 ? -1 : x === 6 ? 1 : 0);
                rb_cr_map_playerPos.y -= (y === 0 ? -1 : y === 6 ? 1 : 0);
                Core_Map_updatePlayerRender();
                alert("The door is locked! Stand adjacent facing the door and press Space/E to pick or break it.");
                return;
            }

            if (Math.random() < 0.25) {
                Core_Map_triggerDoorChallenge();
            }

            const entryDirection = rb_cr_map_OPPOSITE_WALL[wallKey];
            Core_Map_loadRoom(doorObj.targetRoom, entryDirection);
        }

        function Core_Map_interact() {
            const offset = rb_cr_map_DIR_OFFSETS[rb_cr_map_playerFacing];
            const targetX = rb_cr_map_playerPos.x + offset.x;
            const targetY = rb_cr_map_playerPos.y + offset.y;

            if (targetX < 0 || targetX >= rb_cr_map_GRID_SIZE || targetY < 0 || targetY >= rb_cr_map_GRID_SIZE) return;

            const char = rb_cr_map_activeLayout[targetY][targetX];

            if (char === rb_cr_map_DOOR_CHAR) {
                const doorObj = rb_cr_map_doorData[rb_cr_map_playerFacing];
                if (doorObj && doorObj.isLocked) {
                    const choice = confirm("Press OK to Pick Lock, or Cancel to Break Down Door.");
                    const onUnlocked = (success) => {
                        if (success) Core_Map_renderBoard();
                    };

                    if (choice) {
                        Core_Map_pickLockDoor(doorObj, onUnlocked);
                    } else {
                        Core_Map_breakDownDoor(doorObj, onUnlocked);
                    }
                    return;
                }
            }

            if ([
                '(', '<', rb_cr_map_ROCK_CHAR, rb_cr_map_TREE_1_CHAR, rb_cr_map_TREE_2_CHAR, rb_cr_map_TREE_3_CHAR, '?', '&', rb_cr_map_BOSS_CHAR, rb_cr_map_MERCHANT_CHAR, rb_cr_map_FOUNTAIN_CHAR, rb_cr_map_WATER_CHAR, rb_cr_map_TRAP_CHAR,
                rb_cr_map_BOOKSHELF_CHAR, rb_cr_map_WARDROBE_CHAR, rb_cr_map_BELLPOST_CHAR, rb_cr_map_FIREPLACE_CHAR, rb_cr_map_CLOSED_DRESSER_CHAR, rb_cr_map_VASE_TABLE_CHAR, rb_cr_map_CHAIR_CHAR, rb_cr_map_THRONE_CHAR,
                rb_cr_map_LAMP_CHAR, rb_cr_map_GLOBE_CHAR, rb_cr_map_TABLE_CHAR, rb_cr_map_ALCHEMIST_TABLE_CHAR, rb_cr_map_CRATE_CHAR, rb_cr_map_BARREL_CHAR, rb_cr_map_COBWEB_CHAR, rb_cr_map_TOILET_CHAR
            ].includes(char)) {
                
                const roomItems = rb_cr_map_currentFloorRooms[rb_cr_map_currentRoomIndex].items;
                const itemData = roomItems[`${targetX},${targetY}`];

                if (char === rb_cr_map_MERCHANT_CHAR) {
                    Core_Map_interactWithMerchant(targetX, targetY);
                } else if (char === rb_cr_map_TOILET_CHAR) {
                    alert("FLUSH! The plumbing backfires violently! The room begins to flood!");
                    Core_Map_triggerDoorChallenge();
                } else if (char === rb_cr_map_BARREL_CHAR) {
                    rb_cr_map_activeLayout[targetY][targetX] = ' ';
                    if (itemData) itemData.state = 'DESTROYED';
                    const gold = Math.floor(Math.random() * 30) + 15;
                    rb_cr_map_playerScore += gold;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    alert(`You bust open the wooden barrel and find strange reagents (+${gold} Score)!`);
                    Core_Map_renderBoard();
                } else if (char === rb_cr_map_CRATE_CHAR) {
                    rb_cr_map_activeLayout[targetY][targetX] = ' ';
                    if (itemData) itemData.state = 'DESTROYED';
                    const gold = Math.floor(Math.random() * 25) + 10;
                    rb_cr_map_playerScore += gold;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    alert(`You smashed open the wooden storage crate and found extra supplies! (+${gold} Score)`);
                    Core_Map_renderBoard();
                } else if (char === rb_cr_map_COBWEB_CHAR) {
                    rb_cr_map_activeLayout[targetY][targetX] = ' ';
                    if (itemData) itemData.state = 'DESTROYED';
                    rb_cr_map_playerScore += 5;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    alert("You cleared away the dusty cobwebs (+5 Score).");
                    Core_Map_renderBoard();
                } else if (char === rb_cr_map_BOOKSHELF_CHAR) {
                    Core_Map_interactWithBookshelf(targetX, targetY);
                } else if (char === rb_cr_map_CHAIR_CHAR) {
                    alert("You take a brief rest in the comfortable study chair.");
                } else if (char === rb_cr_map_THRONE_CHAR) {
                    alert("You sit upon the ornate golden throne! You feel a surge of royal power (+75 Score).");
                    rb_cr_map_playerScore += 75;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                } else if (char === rb_cr_map_LAMP_CHAR) {
                    alert("The warm brass lamp casts a soft yellow glow on the surrounding books.");
                } else if (char === rb_cr_map_GLOBE_CHAR) {
                    alert("You spin the terrestrial globe! It reveals unknown lands (+15 Score).");
                    rb_cr_map_playerScore += 15;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                } else if (char === rb_cr_map_TABLE_CHAR) {
                    alert("A sturdy wooden desk covered in old parchment and inkwells.");
                } else if (char === rb_cr_map_ALCHEMIST_TABLE_CHAR) {
                    alert("Bubbling glass retorts and strange concoctions cover the table! You distill a strange potion (+35 Score).");
                    rb_cr_map_playerScore += 35;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                } else if (char === '(') {
                    rb_cr_map_activeLayout[targetY][targetX] = ')';
                    if (itemData) itemData.char = ')';
                    rb_cr_map_playerScore += 50;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    alert("You opened the chest and secured the loot! (+50 Score)");
                    Core_Map_renderBoard();
                } else if (char === '<' || char === rb_cr_map_ROCK_CHAR) {
                    rb_cr_map_activeLayout[targetY][targetX] = ' ';
                    if (itemData) itemData.state = 'DESTROYED';
                    rb_cr_map_playerScore += 20;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    alert("You cleared away the rubble!");
                    Core_Map_renderBoard();
                } else if (char === rb_cr_map_TREE_1_CHAR || char === rb_cr_map_TREE_2_CHAR || char === rb_cr_map_TREE_3_CHAR) {
                    alert("An ancient, sturdy tree stands firm.");
                } else if (char === rb_cr_map_WARDROBE_CHAR) {
                    rb_cr_map_activeLayout[targetY][targetX] = rb_cr_map_WARDROBE_KNOCKED_CHAR;
                    if (itemData) itemData.char = rb_cr_map_WARDROBE_KNOCKED_CHAR;
                    rb_cr_map_playerScore += 15;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    alert("You pushed over the wardrobe with a heavy thud!");
                    Core_Map_renderBoard();
                } else if (char === rb_cr_map_BELLPOST_CHAR) {
                    Core_Map_playBellChime();
                    alert("DING! The bell post rings loudly through the dungeon corridor.");
                } else if (char === rb_cr_map_FIREPLACE_CHAR) {
                    alert("The hearth crackles with warm embers.");
                } else if (char === rb_cr_map_CLOSED_DRESSER_CHAR) {
                    rb_cr_map_activeLayout[targetY][targetX] = rb_cr_map_OPENED_DRESSER_CHAR;
                    if (itemData) itemData.char = rb_cr_map_OPENED_DRESSER_CHAR;
                    rb_cr_map_playerScore += 25;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    alert("You opened the dresser drawers and found some loot (+25 score)!");
                    Core_Map_renderBoard();
                } else if (char === rb_cr_map_VASE_TABLE_CHAR) {
                    rb_cr_map_activeLayout[targetY][targetX] = rb_cr_map_VASE_TABLE_KNOCKED_CHAR;
                    if (itemData) itemData.char = rb_cr_map_VASE_TABLE_KNOCKED_CHAR;
                    rb_cr_map_playerScore += 10;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    alert("Shatter! You knocked the vase off the table.");
                    Core_Map_renderBoard();
                } else if (char === rb_cr_map_TRAP_CHAR) {
                    rb_cr_map_activeLayout[targetY][targetX] = ' ';
                    if (itemData) itemData.state = 'DESTROYED';
                    rb_cr_map_playerScore += 15;
                    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
                    alert("Trap disarmed!");
                    Core_Map_renderBoard();
                } else if (char === '?') {
                    Core_Map_triggerChallenge('D', itemData, () => Core_Map_renderBoard());
                } else if (char === '&') {
                    Core_Map_triggerChallenge('G', itemData, () => Core_Map_renderBoard());
                } else if (char === rb_cr_map_BOSS_CHAR) {
                    Core_Map_triggerChallenge('U', itemData, () => Core_Map_renderBoard());
                } else if (char === rb_cr_map_FOUNTAIN_CHAR) {
                    Core_Map_triggerChallenge('F', itemData, () => Core_Map_renderBoard());
                } else if (char === rb_cr_map_WATER_CHAR) {
                    const parent = Core_Map_findAssociatedFountain(targetX, targetY);
                    if (parent) {
                        Core_Map_triggerChallenge('F', parent.data, () => Core_Map_renderBoard());
                    }
                }
            }
        }