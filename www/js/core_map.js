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

var map = [
    rb_cr_map_BRICK,rb_cr_map_BRICK,rb_cr_map_DOOR_CHAR,rb_cr_map_BRICK,rb_cr_map_BRICK,
	rb_cr_map_BRICK,rb_cr_map_CHAIR_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRATE_CHAR,rb_cr_map_BRICK,
	rb_cr_map_BRICK,rb_cr_map_LAMP_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRATE_CHAR,rb_cr_map_BRICK,
	rb_cr_map_BRICK,rb_cr_map_BOOKSHELF_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRATE_CHAR,rb_cr_map_BRICK,
	rb_cr_map_BRICK,rb_cr_map_BRICK,rb_cr_map_BRKN_DOOR_CHAR,rb_cr_map_BRICK,rb_cr_map_BRICK
];

var rb_player = {
  x: 2,
  y: 2,
  icon: "@",
  dir: "down" // Stores last direction moved/looked: "up", "down", "left", "right"
};

function world_gen() {
  const table = document.getElementById("map");
  table.replaceChildren();

  const rowWidth = 5;
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

    // Check if player position matches current tile coordinates
    if (tileX === rb_player.x && tileY === rb_player.y) {
      cell.textContent = rb_player.icon;
      cell.classList.add("player-cell");
      cell.classList.add("facing-" + rb_player.dir);

      // Get class color string (e.g., "white", "red", "purple") from class_colors array
      // Default to class_colors[0] ("white") if player.class is undefined
      const playerColorClass = class_colors[player.class] || class_colors[0];
      
      // Apply class color (DO NOT apply TILE_STYLE_MAP[tileChar])
      cell.classList.add(playerColorClass);
    } else {
      cell.textContent = tileChar;

      // Apply standard map tile styling if it exists in the map
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

const MAP_WIDTH = 5;
const MAP_HEIGHT = Math.ceil(map.length / MAP_WIDTH);

// 1. Movement & Collision
function movePlayer(dx, dy, dirName) {
  // Always update the facing direction, even if blocked by a wall
  rb_player.dir = dirName;

  const targetX = rb_player.x + dx;
  const targetY = rb_player.y + dy;

  // Boundary check
  if (targetX >= 0 && targetX < MAP_WIDTH && targetY >= 0 && targetY < MAP_HEIGHT) {
    const targetIndex = targetY * MAP_WIDTH + targetX;
    const targetTile = map[targetIndex];

    // Walkable only if it's a crushed path or a rock
    const isWalkable = (targetTile === rb_cr_map_CRUSHED_PATH || targetTile === rb_cr_map_ROCK_CHAR);

    if (isWalkable) {
      rb_player.x = targetX;
      rb_player.y = targetY;
    }
  }

  // Re-render to reflect move/facing change
  world_gen();
}

// Helper: Get target tile index in front of player based on current direction
function getTargetIndexInFront() {
  let targetX = rb_player.x;
  let targetY = rb_player.y;

  if (rb_player.dir === "up") targetY -= 1;
  else if (rb_player.dir === "down") targetY += 1;
  else if (rb_player.dir === "left") targetX -= 1;
  else if (rb_player.dir === "right") targetX += 1;

  // Out of bounds safety check
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

// 2. Search Action: Replaces breakable objects with a crushed path
function actionSearch() {
  const targetIdx = getTargetIndexInFront();
  if (targetIdx !== -1) {
    const currentTile = map[targetIdx];
    
    // Cannot search empty path, rocks, or indestructible structures
    if (
      currentTile !== rb_cr_map_CRUSHED_PATH &&
      currentTile !== rb_cr_map_ROCK_CHAR &&
      !isIndestructible(currentTile)
    ) {
      map[targetIdx] = rb_cr_map_CRUSHED_PATH;
      world_gen();
    }
  }
}

// 3. Break Action: Destroys breakable objects into rocks
function actionBreak() {
  const targetIdx = getTargetIndexInFront();
  if (targetIdx !== -1) {
    const currentTile = map[targetIdx];

    // Block breaking if it's ground, existing rock, or an indestructible tile
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

// 4. Interact Action: Dedicated handler for doors, boss tiles, etc.
function actionInteract() {
  const targetIdx = getTargetIndexInFront();
  if (targetIdx !== -1) {
    const currentTile = map[targetIdx];

    if (currentTile === rb_cr_map_DOOR_CHAR) {
      
      //activate the next door view
      Engine_Hud(3);
      world_gen();
    } else if (currentTile === rb_cr_map_BOSS_CHAR) {
      // Example: Trigger boss fight logic here
      console.log("Boss encounter triggered!");
    }
  }
}

// Updated Keyboard Controls
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

    // Action Key Bindings
    case "e":
    case "E":
      actionSearch();
      break;
    case "f":
    case "F":
      actionBreak();
      break;
    case " ":
    case "Enter":
      actionInteract(); // Use space/enter to interact with doors/bosses
      break;
  }
});