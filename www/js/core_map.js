// --- Character Keys ---
const rb_cr_map_TORCH_CHAR = 'Z';
const rb_cr_map_DOOR_CHAR = ':';
const rb_cr_map_BRKN_DOOR_CHAR = 'K';
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

const rb_cr_map_SHIELD_WALL_CHAR = 'e';
const rb_cr_map_WINDOW_WALL_CHAR = 'f';
const rb_cr_map_BANNER_WALL_CHAR = 'h';

const rb_cr_map_CRUSHED_PATH = 'O';
const rb_cr_map_BRICK = '#';

const TILE_STYLE_MAP = {
  [rb_cr_map_TORCH_CHAR]: "rb_st_map_item_torch",
  [rb_cr_map_ROCK_CHAR]: "rb_st_map_item_rock",
  [rb_cr_map_BOSS_CHAR]: "rb_st_map_item_boss",
  [rb_cr_map_MERCHANT_CHAR]: "rb_st_map_item_merchant",
  [rb_cr_map_FOUNTAIN_CHAR]: "rb_st_map_item_fountain",
  [rb_cr_map_GRASS_CHAR]: "rb_st_map_item_grass",
  [rb_cr_map_TREE_1_CHAR]: "rb_st_map_item_tree",
  [rb_cr_map_TREE_2_CHAR]: "rb_st_map_item_tree",
  [rb_cr_map_TREE_3_CHAR]: "rb_st_map_item_tree",
  [rb_cr_map_TRAP_CHAR]: "rb_st_map_item_trap",
  [rb_cr_map_BOOKSHELF_CHAR]: "rb_st_map_item_bookshelf",
  [rb_cr_map_WARDROBE_CHAR]: "rb_st_map_item_wardrobe",
  [rb_cr_map_BELLPOST_CHAR]: "rb_st_map_item_bellpost",
  [rb_cr_map_CHAIR_CHAR]: "rb_st_map_item_chair",
  [rb_cr_map_THRONE_CHAR]: "rb_st_map_item_throne",
  [rb_cr_map_LAMP_CHAR]: "rb_st_map_item_lamp",
  [rb_cr_map_GLOBE_CHAR]: "rb_st_map_item_globe",
  [rb_cr_map_TABLE_CHAR]: "rb_st_map_item_table",
  [rb_cr_map_ALCHEMIST_TABLE_CHAR]: "rb_st_map_item_alchemist_table",
  [rb_cr_map_DRESSER_CHAR]: "rb_st_map_item_dresser",
  [rb_cr_map_FIREPLACE_CHAR]: "rb_st_map_item_fireplace",
  [rb_cr_map_VASE_TABLE_CHAR]: "rb_st_map_item_table_vase",
  [rb_cr_map_CRATE_CHAR]: "rb_st_map_item_crate",
  [rb_cr_map_BARREL_CHAR]: "rb_st_map_item_barrel",
  [rb_cr_map_COBWEB_CHAR]: "rb_st_map_item_cobweb",
  [rb_cr_map_TOILET_CHAR]: "rb_st_map_item_toilet",
  [rb_cr_map_DOOR_CHAR]: "rb_st_map_item_door",
  [rb_cr_map_BRKN_DOOR_CHAR]: "rb_st_map_item_broken_door",
  [rb_cr_map_BRICK]: "rb_st_map_item_brick",
  [rb_cr_map_CRUSHED_PATH]: "rb_st_map_item_floor"
};

var room_prefab = [
  /*Simple Room*/[
  rb_cr_map_BRICK,rb_cr_map_BRICK,rb_cr_map_DOOR_CHAR,rb_cr_map_BRICK,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_BRICK,rb_cr_map_BRKN_DOOR_CHAR,rb_cr_map_BRICK,rb_cr_map_BRICK],
  /*Toilet Room*/[
  rb_cr_map_BRICK,rb_cr_map_BRICK,rb_cr_map_DOOR_CHAR,rb_cr_map_BRICK,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_CRUSHED_PATH,rb_cr_map_TOILET_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_BRICK,rb_cr_map_BRKN_DOOR_CHAR,rb_cr_map_BRICK,rb_cr_map_BRICK],
  /*Default Room*/[
  rb_cr_map_BRICK,rb_cr_map_BRICK,rb_cr_map_DOOR_CHAR,rb_cr_map_BRICK,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_CHAIR_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_FIREPLACE_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_BOOKSHELF_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRUSHED_PATH,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_BRICK,rb_cr_map_BRKN_DOOR_CHAR,rb_cr_map_BRICK,rb_cr_map_BRICK],
  /*Garden*/[
  rb_cr_map_BRICK,rb_cr_map_BRICK,rb_cr_map_DOOR_CHAR,rb_cr_map_BRICK,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_TREE_2_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_GRASS_CHAR,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_GRASS_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_GRASS_CHAR,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_GRASS_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_TREE_3_CHAR,rb_cr_map_BRICK,
  rb_cr_map_BRICK,rb_cr_map_BRICK,rb_cr_map_BRKN_DOOR_CHAR,rb_cr_map_BRICK,rb_cr_map_BRICK]
];

// --- Dungeon & Room Generation State ---
var currentRoomIndex = 1; // Active room (1 to 5; 0 is entry backtrack, 6 is boss)
var roomCleared = {
  0: true,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true
};

var room_tracker = [[], [], [], [], [], [], []];
var map = [];

// Room variables maintained for global reference
var room0 = [];
var room1 = [];
var room2 = [];
var room3 = [];
var room4 = [];
var room5 = [];
var room6 = [];

function initDungeonRooms() {
  // room0: Backtrack room layout
  room_tracker[0] = [...room_prefab[0]];

  // Generate rooms 1 through 5 from prefabs
  for (let i = 1; i <= 5; i++) {
    const randomPrefabIdx = Math.floor(Math.random() * room_prefab.length);
    room_tracker[i] = [...room_prefab[randomPrefabIdx]];
  }

  // room6: Custom Boss room layout
  room_tracker[6] = [
    rb_cr_map_BRICK, rb_cr_map_BRICK, rb_cr_map_BRICK, rb_cr_map_BRICK, rb_cr_map_BRICK,
    rb_cr_map_BRICK, rb_cr_map_CRUSHED_PATH, rb_cr_map_BOSS_CHAR, rb_cr_map_CRUSHED_PATH, rb_cr_map_BRICK,
    rb_cr_map_BRICK, rb_cr_map_CRUSHED_PATH, rb_cr_map_CRUSHED_PATH, rb_cr_map_CRUSHED_PATH, rb_cr_map_BRICK,
    rb_cr_map_BRICK, rb_cr_map_CRUSHED_PATH, rb_cr_map_CRUSHED_PATH, rb_cr_map_CRUSHED_PATH, rb_cr_map_BRICK,
    rb_cr_map_BRICK, rb_cr_map_BRICK, rb_cr_map_BRKN_DOOR_CHAR, rb_cr_map_BRICK, rb_cr_map_BRICK
  ];

  // Assign global room references
  room0 = room_tracker[0];
  room1 = room_tracker[1];
  room2 = room_tracker[2];
  room3 = room_tracker[3];
  room4 = room_tracker[4];
  room5 = room_tracker[5];
  room6 = room_tracker[6];

  // Set initial map state to room1
  map = [...room_tracker[currentRoomIndex]];
}

var rb_player = {
  x: 2,
  y: 2,
  icon: "@",
  dir: "down"
};

const MAP_WIDTH = 5;
const MAP_HEIGHT = 5;

function world_gen() {
  const table = document.getElementById("map");
  if (!table) return;
  
  table.replaceChildren();

  const rowWidth = MAP_WIDTH;
  let currentRow = document.createElement("tr");

  for (let i = 0; i < map.length; i++) {
    const tileX = i % rowWidth;
    const tileY = Math.floor(i / rowWidth);

    if (i > 0 && i % rowWidth === 0) {
      table.appendChild(currentRow);
      currentRow = document.createElement("tr");
    }

    const cell = document.createElement("td");
    const tileChar = map[i];

    if (tileX === rb_player.x && tileY === rb_player.y) {
      cell.textContent = rb_player.icon;
      cell.classList.add("player-cell");
      cell.classList.add("facing-" + rb_player.dir);

      const playerColorClass = (typeof class_colors !== 'undefined' && typeof player !== 'undefined' && class_colors[player.class]) 
        ? class_colors[player.class] 
        : "white";
      
      cell.classList.add(playerColorClass);
    } else {
      cell.textContent = tileChar;

      if (TILE_STYLE_MAP[tileChar]) {
        cell.classList.add(TILE_STYLE_MAP[tileChar]);
      }
    }

    currentRow.appendChild(cell);
  }

  if (currentRow.hasChildNodes()) {
    table.appendChild(currentRow);
  }
}

// --- Movement & Boundaries ---
function movePlayer(dx, dy, dirName) {
  rb_player.dir = dirName;

  const targetX = rb_player.x + dx;
  const targetY = rb_player.y + dy;

  if (targetX >= 0 && targetX < MAP_WIDTH && targetY >= 0 && targetY < MAP_HEIGHT) {
    const targetIndex = targetY * MAP_WIDTH + targetX;
    const targetTile = map[targetIndex];

    const isWalkable = (targetTile === rb_cr_map_CRUSHED_PATH || targetTile === rb_cr_map_ROCK_CHAR);

    if (isWalkable) {
      rb_player.x = targetX;
      rb_player.y = targetY;
    }
  }

  world_gen();
}

function getTargetIndexInFront() {
  let targetX = rb_player.x;
  let targetY = rb_player.y;

  if (rb_player.dir === "up") targetY -= 1;
  else if (rb_player.dir === "down") targetY += 1;
  else if (rb_player.dir === "left") targetX -= 1;
  else if (rb_player.dir === "right") targetX += 1;

  if (targetX < 0 || targetX >= MAP_WIDTH || targetY < 0 || targetY >= MAP_HEIGHT) {
    return -1;
  }

  return targetY * MAP_WIDTH + targetX;
}

function isIndestructible(tile) {
  return (
    tile === rb_cr_map_BRICK ||
    tile === rb_cr_map_DOOR_CHAR ||
    tile === rb_cr_map_BRKN_DOOR_CHAR ||
    tile === rb_cr_map_BOSS_CHAR
  );
}

// --- Room Navigation ---
function transitionRoom(direction) {
  // Save modifications to current room before swapping maps
  room_tracker[currentRoomIndex] = [...map];

  if (direction === "forward") {
    if (currentRoomIndex < 6) {
      currentRoomIndex++;
      map = [...room_tracker[currentRoomIndex]];
      
      // Spawn at bottom broken door facing up
      rb_player.x = 2;
      rb_player.y = 3;
      rb_player.dir = "up";
    }
  } else if (direction === "backward") {
    if (currentRoomIndex > 0) {
      currentRoomIndex--;
      map = [...room_tracker[currentRoomIndex]];
      
      // Spawn at top door facing down
      rb_player.x = 2;
      rb_player.y = 1;
      rb_player.dir = "down";
    }
  }

  world_gen();
}

// --- Combined Actions ---
function actionBreak() {
  const targetIdx = getTargetIndexInFront();
  if (targetIdx !== -1) {
    const currentTile = map[targetIdx];

    if (
      currentTile !== rb_cr_map_CRUSHED_PATH &&
      currentTile !== rb_cr_map_ROCK_CHAR &&
      !isIndestructible(currentTile)
    ) {
      map[targetIdx] = rb_cr_map_ROCK_CHAR;
      world_gen();
    }
  }
}

function actionInteract() {
  const targetIdx = getTargetIndexInFront();
  if (targetIdx === -1) return;

  const currentTile = map[targetIdx];

  // 1. Top Door (Forward Transition)
  if (currentTile === rb_cr_map_DOOR_CHAR) {
    if (roomCleared[currentRoomIndex]) {
      transitionRoom("forward");
    } else {
      console.log("Door is locked! Clear the room first.");
    }
  } 
  // 2. Bottom Broken Door (Backward Transition)
  else if (currentTile === rb_cr_map_BRKN_DOOR_CHAR && targetIdx >= 20) {
    transitionRoom("backward");
  }
  // 3. Boss Encounter
  else if (currentTile === rb_cr_map_BOSS_CHAR) {
    console.log("Boss encounter triggered!");
  } 
  // 4. Fountain Restoration
  else if (currentTile === rb_cr_map_FOUNTAIN_CHAR) {
    console.log("Drank from fountain! HP restored.");
    map[targetIdx] = rb_cr_map_CRUSHED_PATH;
    world_gen();
  }
  // 5. General Search / Clear Furniture
  else if (
    currentTile !== rb_cr_map_CRUSHED_PATH &&
    currentTile !== rb_cr_map_ROCK_CHAR &&
    !isIndestructible(currentTile)
  ) {
    console.log("Searched container/furniture!");
    map[targetIdx] = rb_cr_map_CRUSHED_PATH;
    world_gen();
  }
}

// --- Controls ---
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      movePlayer(0, -1, "up");
      break;
    case "ArrowDown":
    case "s":
    case "S":
      movePlayer(0, 1, "down");
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      movePlayer(-1, 0, "left");
      break;
    case "ArrowRight":
    case "d":
    case "D":
      movePlayer(1, 0, "right");
      break;

    // Combined Search / Interact Action
    case "e":
    case "E":
    case " ":
    case "Enter":
      actionInteract();
      break;

    // Break Action
    case "f":
    case "F":
      actionBreak();
      break;
  }
});

// Initialize dungeon rooms and generate initial map
initDungeonRooms();
world_gen();