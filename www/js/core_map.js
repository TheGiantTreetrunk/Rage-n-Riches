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

var map = [
    rb_cr_map_BRICK,rb_cr_map_BRICK,rb_cr_map_DOOR_CHAR,rb_cr_map_BRICK,rb_cr_map_BRICK,
	rb_cr_map_BRICK,rb_cr_map_CHAIR_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRATE_CHAR,rb_cr_map_BRICK,
	rb_cr_map_BRICK,rb_cr_map_LAMP_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRATE_CHAR,rb_cr_map_BRICK,
	rb_cr_map_BRICK,rb_cr_map_BOOKSHELF_CHAR,rb_cr_map_CRUSHED_PATH,rb_cr_map_CRATE_CHAR,rb_cr_map_BRICK,
	rb_cr_map_BRICK,rb_cr_map_BRICK,rb_cr_map_DOOR_CHAR,rb_cr_map_BRICK,rb_cr_map_BRICK
];

function world_gen() {

    document.getElementById("map").innerHTML = "";
	var x = 5;
	var s = 0;

	for(i = 0; i < map.length; i++) {
		if (s < x) {
			document.getElementById("map").innerHTML += map[i];
		} else {
			document.getElementById("map").innerHTML += "<br>";
			document.getElementById("map").innerHTML += map[i];
			s = 0; 
		}

		s += 1;
	}
}