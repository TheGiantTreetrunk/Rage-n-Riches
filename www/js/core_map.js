/* =================================================================
   RAGE 'N' RICHES - CORE MAP ENGINE (FIXED & REMASTERED)
   ================================================================= */

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
const rb_cr_map_actionLog = document.getElementById('rb_st_map_action_log');

// --- Character Keys ---
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
const rb_cr_map_WARDROBE_CHAR = 'J';
const rb_cr_map_BELLPOST_CHAR = 'P';
const rb_cr_map_CHAIR_CHAR = 't';
const rb_cr_map_THRONE_CHAR = 'z';
const rb_cr_map_LAMP_CHAR = 's';
const rb_cr_map_GLOBE_CHAR = 'u';
const rb_cr_map_TABLE_CHAR = 'v';
const rb_cr_map_ALCHEMIST_TABLE_CHAR = 'y';
const rb_cr_map_DRESSER_CHAR = 'V';
const rb_cr_map_FIREPLACE_CHAR = 'Q';
const rb_cr_map_VASE_TABLE_CHAR = 'X';
const rb_cr_map_CRATE_CHAR = 'r';
const rb_cr_map_BARREL_CHAR = 'x';
const rb_cr_map_COBWEB_CHAR = 'w';
const rb_cr_map_TOILET_CHAR = 'q';

/*
Not Used
const rb_cr_map_BOOKSHELF_KNOCKED_CHAR = 'i';
const rb_cr_map_WARDROBE_KNOCKED_CHAR = 'j';
const rb_cr_map_OPENED_DRESSER_CHAR = 'W';
const rb_cr_map_VASE_TABLE_KNOCKED_CHAR = 'Y';
*/

const rb_cr_map_SHIELD_WALL_CHAR = 'e';
const rb_cr_map_WINDOW_WALL_CHAR = 'f';
const rb_cr_map_BANNER_WALL_CHAR = 'h';

// --- Game State Variables ---
let rb_cr_map_currentFloorNum = 1;
let rb_cr_map_currentRoomIndex = 0;
let rb_cr_map_playerScore = 0;
let rb_cr_map_playerPos = { x: 3, y: 3 };
let rb_cr_map_playerFacing = 'SOUTH';
let rb_cr_map_playerElement = null;
let rb_cr_map_facingIndicatorElement = null;

let rb_cr_map_currentFloorRooms = [];
let rb_cr_map_activeLayout = [];
let rb_cr_map_doorData = {};
let rb_cr_map_pathTiles = new Set();

const rb_cr_map_WALL_DIRS = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
const rb_cr_map_OPPOSITE_WALL = { 'NORTH': 'SOUTH', 'SOUTH': 'NORTH', 'EAST': 'WEST', 'WEST': 'EAST' };
const rb_cr_map_DIR_OFFSETS = { 'NORTH': { x: 0, y: -1 }, 'SOUTH': { x: 0, y: 1 }, 'WEST': { x: -1, y: 0 }, 'EAST': { x: 1, y: 0 } };
const rb_cr_map_FACING_ARROWS = { 'NORTH': '▲', 'SOUTH': '▼', 'WEST': '◄', 'EAST': '►' };
const rb_cr_map_DOOR_COORDS = { 'NORTH': { x: 3, y: 0 }, 'SOUTH': { x: 3, y: 6 }, 'WEST': { x: 0, y: 3 }, 'EAST': { x: 6, y: 3 } };
const rb_cr_map_ENTRY_SPAWNS = { 'NORTH': { x: 3, y: 1 }, 'SOUTH': { x: 3, y: 5 }, 'WEST': { x: 1, y: 3 }, 'EAST': { x: 5, y: 3 } };

// --- UI Logger & Utilities ---
function Core_Map_Log(message) {
    if (rb_cr_map_actionLog) rb_cr_map_actionLog.innerText = message;
}

function Core_Map_AddScore(amount) {
    rb_cr_map_playerScore += amount;
    rb_cr_map_uiScore.innerText = rb_cr_map_playerScore;
}

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
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
    } catch(e) {}
}

// --- Item Color Mapping ---
function Core_Map_getItemColor(char) {
    switch (char) {
        case rb_cr_map_BOSS_CHAR: return '#ff3333'; // Red Boss
        case rb_cr_map_TORCH_CHAR: return '#ffaa00'; // Orange/Yellow Flame
        case rb_cr_map_LAMP_CHAR: return '#ffd700';
        case rb_cr_map_GLOBE_CHAR: return '#00bcd4';
        case rb_cr_map_FIREPLACE_CHAR: return '#ff5722';
        case rb_cr_map_CHAIR_CHAR:
        case rb_cr_map_THRONE_CHAR: return '#b8860b'; // Wood/Gold
        case rb_cr_map_BOOKSHELF_CHAR: return '#8b4513';
        case rb_cr_map_CRATE_CHAR:
        case rb_cr_map_BARREL_CHAR: return '#cd853f';
        case rb_cr_map_ROCK_CHAR: return '#777777';
        case '(': return '#ffdf00'; // Chests
        case ')': return '#888888'; // Opened chests
        default: return '#ffffff';
    }
}

// --- Room Prefab Blueprints ---
const Core_Map_RoomPrefabs = {
    throne: () => ({
        '3,2': { char: rb_cr_map_THRONE_CHAR, state: 'INTACT' },
        '1,1': { char: rb_cr_map_TORCH_CHAR, state: 'INTACT' },
        '5,1': { char: rb_cr_map_TORCH_CHAR, state: 'INTACT' },
        '2,3': { char: rb_cr_map_CHAIR_CHAR, state: 'INTACT' },
        '4,3': { char: rb_cr_map_CHAIR_CHAR, state: 'INTACT' },
        '5,5': { char: '(', state: 'INTACT' }
    }),
    study: () => ({
        '1,1': { char: rb_cr_map_BOOKSHELF_CHAR, state: 'INTACT' },
        '1,2': { char: rb_cr_map_BOOKSHELF_CHAR, state: 'INTACT' },
        '1,4': { char: rb_cr_map_BOOKSHELF_CHAR, state: 'INTACT' },
        '3,3': { char: rb_cr_map_CHAIR_CHAR, state: 'INTACT' },
        '5,5': { char: rb_cr_map_LAMP_CHAR, state: 'INTACT' },
        '1,5': { char: rb_cr_map_GLOBE_CHAR, state: 'INTACT' },
        '5,1': { char: rb_cr_map_FIREPLACE_CHAR, state: 'INTACT' }
    }),
    storage: () => ({
        '1,1': { char: rb_cr_map_CRATE_CHAR, state: 'INTACT' },
        '5,1': { char: rb_cr_map_BARREL_CHAR, state: 'INTACT' },
        '1,5': { char: rb_cr_map_BARREL_CHAR, state: 'INTACT' },
        '5,5': { char: rb_cr_map_CRATE_CHAR, state: 'INTACT' },
        '3,3': { char: rb_cr_map_COBWEB_CHAR, state: 'INTACT' }
    }),
    standard: () => ({
        '3,3': { char: '(', state: 'INTACT' },
        '2,2': { char: rb_cr_map_BARREL_CHAR, state: 'INTACT' },
        '4,4': { char: rb_cr_map_ROCK_CHAR, state: 'INTACT' }
    })
};

// --- Floor & Room Generation ---
function Core_Map_generateFloorData() {
    rb_cr_map_currentFloorRooms = [];
    const prefabKeys = Object.keys(Core_Map_RoomPrefabs);

    // Room 1: Start Room
    const firstExit = rb_cr_map_WALL_DIRS[Math.floor(Math.random() * rb_cr_map_WALL_DIRS.length)];
    const room1 = {
        index: 0,
        entryWall: null,
        forwardWall: firstExit,
        doors: { [firstExit]: { type: 'FORWARD', isLocked: false, targetRoom: 1 } },
        items: { '1,1': { char: rb_cr_map_TORCH_CHAR, state: 'INTACT' } },
        wallDecorations: Core_Map_generateWallDecorations(null, firstExit)
    };
    room1.pathTiles = Core_Map_generatePathsForRoom(room1.doors);
    rb_cr_map_currentFloorRooms.push(room1);

    // Intermediate Rooms
    for (let i = 1; i < rb_cr_map_TOTAL_ROOMS - 1; i++) {
        const prevRoom = rb_cr_map_currentFloorRooms[i - 1];
        const entryWall = rb_cr_map_OPPOSITE_WALL[prevRoom.forwardWall];
        const availableWalls = rb_cr_map_WALL_DIRS.filter(w => w !== entryWall);
        const forwardWall = availableWalls[Math.floor(Math.random() * availableWalls.length)];
        const isLocked = Math.random() < 0.4; // Locked door chance

        const randomKey = prefabKeys[Math.floor(Math.random() * prefabKeys.length)];
        const roomItems = Core_Map_RoomPrefabs[randomKey]();

        const roomObj = {
            index: i,
            entryWall: entryWall,
            forwardWall: forwardWall,
            doors: {
                [entryWall]: { type: 'BACKWARD', isLocked: false, targetRoom: i - 1 },
                [forwardWall]: { type: 'FORWARD', isLocked: isLocked, targetRoom: i + 1 }
            },
            items: roomItems,
            wallDecorations: Core_Map_generateWallDecorations(entryWall, forwardWall)
        };
        roomObj.pathTiles = Core_Map_generatePathsForRoom(roomObj.doors);
        rb_cr_map_currentFloorRooms.push(roomObj);
    }

    // Room 6: Boss Room
    const prevRoom = rb_cr_map_currentFloorRooms[4];
    const entryWall = rb_cr_map_OPPOSITE_WALL[prevRoom.forwardWall];
    const bossRoomObj = {
        index: 5,
        entryWall: entryWall,
        forwardWall: null,
        bossDefeated: false,
        doors: { [entryWall]: { type: 'BACKWARD', isLocked: false, targetRoom: 4 } },
        wallDecorations: Core_Map_generateWallDecorations(entryWall, null),
        items: {
            '1,1': { char: rb_cr_map_TORCH_CHAR, state: 'INTACT' },
            '5,1': { char: rb_cr_map_TORCH_CHAR, state: 'INTACT' },
            '3,3': { char: rb_cr_map_BOSS_CHAR, state: 'ACTIVE' }
        }
    };
    bossRoomObj.pathTiles = Core_Map_generatePathsForRoom(bossRoomObj.doors);
    rb_cr_map_currentFloorRooms.push(bossRoomObj);
}

function Core_Map_generateWallDecorations(entryWall, forwardWall) {
    const wallItems = {};
    const decs = [rb_cr_map_SHIELD_WALL_CHAR, rb_cr_map_WINDOW_WALL_CHAR, rb_cr_map_BANNER_WALL_CHAR];
    const active = new Set([entryWall, forwardWall].filter(Boolean));

    for (const wall of rb_cr_map_WALL_DIRS) {
        if (active.has(wall)) continue;
        if (Math.random() < 0.5) {
            let coord = { x: 3, y: 3 };
            if (wall === 'NORTH') coord = { x: 3, y: 0 };
            else if (wall === 'SOUTH') coord = { x: 3, y: 6 };
            else if (wall === 'WEST') coord = { x: 0, y: 3 };
            else if (wall === 'EAST') coord = { x: 6, y: 3 };
            wallItems[`${coord.x},${coord.y}`] = decs[Math.floor(Math.random() * decs.length)];
        }
    }
    return wallItems;
}

function Core_Map_generatePathsForRoom(doors) {
    const pathSet = new Set();
    const walls = Object.keys(doors);
    if (walls.length < 2) return pathSet;
    const start = rb_cr_map_ENTRY_SPAWNS[walls[0]];
    const end = rb_cr_map_ENTRY_SPAWNS[walls[1]];
    let cx = start.x, cy = start.y;
    pathSet.add(`${cx},${cy}`);
    while (cx !== end.x || cy !== end.y) {
        if (Math.random() < 0.5 && cx !== end.x) cx += (end.x > cx ? 1 : -1);
        else if (cy !== end.y) cy += (end.y > cy ? 1 : -1);
        else cx += (end.x > cx ? 1 : -1);
        pathSet.add(`${cx},${cy}`);
    }
    return pathSet;
}

// --- Room Loading & Rendering ---
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

    for (const wall of Object.keys(rb_cr_map_doorData)) {
        const coord = rb_cr_map_DOOR_COORDS[wall];
        rb_cr_map_activeLayout[coord.y][coord.x] = rb_cr_map_DOOR_CHAR;
    }

    for (const [posKey, item] of Object.entries(roomData.items)) {
        if (!item || item.state === 'DESTROYED') continue;
        const [ix, iy] = posKey.split(',').map(Number);
        rb_cr_map_activeLayout[iy][ix] = item.char;
    }

    if (entryDirection && rb_cr_map_ENTRY_SPAWNS[entryDirection]) {
        rb_cr_map_playerPos = { ...rb_cr_map_ENTRY_SPAWNS[entryDirection] };
        rb_cr_map_playerFacing = rb_cr_map_OPPOSITE_WALL[entryDirection];
    } else {
        rb_cr_map_playerPos = { x: 3, y: 3 };
        rb_cr_map_playerFacing = 'SOUTH';
    }

    Core_Map_renderBoard();
    Core_Map_Log(`Entered Room ${roomIdx + 1}.`);
}

function Core_Map_renderBoard() {
    rb_cr_map_board.innerHTML = '';

    for (let r = 0; r < rb_cr_map_GRID_SIZE; r++) {
        for (let c = 0; c < rb_cr_map_GRID_SIZE; c++) {
            const tile = document.createElement('div');
            tile.classList.add('rb_st_map_tile');
            const glyph = document.createElement('span');
            glyph.classList.add('rb_st_map_tile_glyph');

            const isWall = (r === 0 || r === rb_cr_map_GRID_SIZE - 1 || c === 0 || c === rb_cr_map_GRID_SIZE - 1);
            if (isWall) {
                glyph.innerText = ' ';
                glyph.classList.add('rb_st_map_tile_wall');
            } else if (rb_cr_map_pathTiles.has(`${c},${r}`)) {
                glyph.innerText = rb_cr_map_CRUSH_FLOOR_CHAR;
                glyph.classList.add('rb_st_map_tile_cracked');
            } else {
                glyph.innerText = '#';
            }
            tile.appendChild(glyph);
            rb_cr_map_board.appendChild(tile);
        }
    }

    for (let r = 0; r < rb_cr_map_GRID_SIZE; r++) {
        for (let c = 0; c < rb_cr_map_GRID_SIZE; c++) {
            const char = rb_cr_map_activeLayout[r][c];
            if (char === rb_cr_map_DOOR_CHAR) {
                Core_Map_spawnDoorNode(c, r);
            } else if (char !== ' ' && char !== 'W') {
                Core_Map_spawnItemNode(c, r, char);
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

function Core_Map_spawnDoorNode(x, y) {
    let wallKey = null;
    if (y === 0) wallKey = 'NORTH';
    else if (y === rb_cr_map_GRID_SIZE - 1) wallKey = 'SOUTH';
    else if (x === 0) wallKey = 'WEST';
    else if (x === rb_cr_map_GRID_SIZE - 1) wallKey = 'EAST';

    const doorObj = wallKey ? rb_cr_map_doorData[wallKey] : null;
    const isLocked = doorObj ? doorObj.isLocked : false;

    const node = document.createElement('div');
    node.classList.add('rb_st_map_door_node');
    node.style.transform = `translate(${x * rb_cr_map_STEP}px, ${y * rb_cr_map_STEP}px)`;
    
    const text = document.createElement('div');
    text.classList.add('rb_st_map_door_text');
    text.innerText = rb_cr_map_DOOR_CHAR;
    
    if (isLocked) {
        text.style.color = '#ff3333';
        text.style.textShadow = '0 0 6px rgba(255, 51, 51, 0.8)';
    } else {
        text.style.color = '#d4af37';
    }

    node.appendChild(text);
    rb_cr_map_board.appendChild(node);
}

function Core_Map_spawnWallDecoration(x, y, char) {
    const node = document.createElement('div');
    node.classList.add('rb_st_map_wall_dec_node');
    node.style.transform = `translate(${x * rb_cr_map_STEP}px, ${y * rb_cr_map_STEP}px)`;
    const text = document.createElement('div');
    text.classList.add('rb_st_map_wall_dec_text');
    text.innerText = char;
    node.appendChild(text);
    rb_cr_map_board.appendChild(node);
}

function Core_Map_spawnItemNode(x, y, char) {
    const node = document.createElement('div');
    node.classList.add('rb_st_map_item_node');
    node.style.transform = `translate(${x * rb_cr_map_STEP}px, ${y * rb_cr_map_STEP}px)`;
    const text = document.createElement('div');
    text.classList.add('rb_st_map_item_text');
    text.innerText = char;
    text.style.color = Core_Map_getItemColor(char);
    node.appendChild(text);
    rb_cr_map_board.appendChild(node);
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

// --- Movement & Interactions ---
function Core_Map_isWalkable(x, y) {
    if (x < 0 || x >= rb_cr_map_GRID_SIZE || y < 0 || y >= rb_cr_map_GRID_SIZE) return false;
    const char = rb_cr_map_activeLayout[y][x];
    if (char === 'W') return false;

    if (char === rb_cr_map_DOOR_CHAR) return true;

    const solidItems = [
        '(', '<', rb_cr_map_ROCK_CHAR, rb_cr_map_TORCH_CHAR, rb_cr_map_BOSS_CHAR, 
        rb_cr_map_MERCHANT_CHAR, rb_cr_map_BOOKSHELF_CHAR, rb_cr_map_CHAIR_CHAR, 
        rb_cr_map_THRONE_CHAR, rb_cr_map_CRATE_CHAR, rb_cr_map_BARREL_CHAR
    ];
    return !solidItems.includes(char);
}

function Core_Map_movePlayer(dx, dy, newFacing) {
    rb_cr_map_playerFacing = newFacing;
    const targetX = rb_cr_map_playerPos.x + dx;
    const targetY = rb_cr_map_playerPos.y + dy;

    if (Core_Map_isWalkable(targetX, targetY)) {
        const tileChar = rb_cr_map_activeLayout[targetY][targetX];
        
        if (tileChar === rb_cr_map_DOOR_CHAR) {
            let wallKey = null;
            if (targetY === 0) wallKey = 'NORTH';
            else if (targetY === rb_cr_map_GRID_SIZE - 1) wallKey = 'SOUTH';
            else if (targetX === 0) wallKey = 'WEST';
            else if (targetX === rb_cr_map_GRID_SIZE - 1) wallKey = 'EAST';

            const doorObj = wallKey ? rb_cr_map_doorData[wallKey] : null;
            if (doorObj && doorObj.isLocked) {
                Core_Map_Log("The door is locked! Press Smash/Space to break it open first.");
                Core_Map_updatePlayerRender();
                return;
            }
        }

        rb_cr_map_playerPos.x = targetX;
        rb_cr_map_playerPos.y = targetY;

        if (tileChar === rb_cr_map_DOOR_CHAR) {
            Core_Map_handleDoorStep(targetX, targetY);
        }
    }
    Core_Map_updatePlayerRender();
}

function Core_Map_handleDoorStep(x, y) {
    let wallKey = null;
    if (y === 0) wallKey = 'NORTH';
    else if (y === 6) wallKey = 'SOUTH';
    else if (x === 0) wallKey = 'WEST';
    else if (x === 6) wallKey = 'EAST';

    const doorObj = wallKey ? rb_cr_map_doorData[wallKey] : null;
    if (!doorObj || doorObj.isLocked) return;

    const entryDirection = rb_cr_map_OPPOSITE_WALL[wallKey];
    Core_Map_loadRoom(doorObj.targetRoom, entryDirection);
}

function Core_Map_interact() {
    const offset = rb_cr_map_DIR_OFFSETS[rb_cr_map_playerFacing];
    const targetX = rb_cr_map_playerPos.x + offset.x;
    const targetY = rb_cr_map_playerPos.y + offset.y;

    if (targetX < 0 || targetX >= rb_cr_map_GRID_SIZE || targetY < 0 || targetY >= rb_cr_map_GRID_SIZE) return;

    const char = rb_cr_map_activeLayout[targetY][targetX];
    const roomItems = rb_cr_map_currentFloorRooms[rb_cr_map_currentRoomIndex].items;
    const itemData = roomItems[`${targetX},${targetY}`];

    if (char === rb_cr_map_DOOR_CHAR) {
        let wallKey = null;
        if (targetY === 0) wallKey = 'NORTH';
        else if (targetY === rb_cr_map_GRID_SIZE - 1) wallKey = 'SOUTH';
        else if (targetX === 0) wallKey = 'WEST';
        else if (targetX === rb_cr_map_GRID_SIZE - 1) wallKey = 'EAST';

        const doorObj = wallKey ? rb_cr_map_doorData[wallKey] : null;
        if (doorObj && doorObj.isLocked) {
            doorObj.isLocked = false;
            Core_Map_Log("You smashed open the locked door!");
            Core_Map_renderBoard();
        } else {
            Core_Map_Log("The door is already unlocked.");
        }
    } else if (char === '(') {
        rb_cr_map_activeLayout[targetY][targetX] = ')';
        if (itemData) itemData.char = ')';
        Core_Map_AddScore(50);
        Core_Map_Log("Opened chest and claimed treasure! (+50 Score)");
        Core_Map_renderBoard();
    } else if (char === rb_cr_map_BARREL_CHAR || char === rb_cr_map_CRATE_CHAR || char === rb_cr_map_ROCK_CHAR) {
        rb_cr_map_activeLayout[targetY][targetX] = ' ';
        if (itemData) itemData.state = 'DESTROYED';
        Core_Map_AddScore(25);
        Core_Map_Log("Smashing success! Cleared obstacle (+25 Score).");
        Core_Map_renderBoard();
    } else if (char === rb_cr_map_BOSS_CHAR) {
        Core_Map_AddScore(500);
        Core_Map_Log("VICTORY! Boss defeated! (+500 Score). Advancing floor...");
        rb_cr_map_currentFloorNum++;
        rb_cr_map_uiFloor.innerText = rb_cr_map_currentFloorNum;
        Core_Map_generateFloorData();
        Core_Map_loadRoom(0);
    } else {
        Core_Map_Log("You inspect the target, but nothing happens.");
    }
}