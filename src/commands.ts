import "dotenv/config";
import { InstallGlobalCommands } from "./utils.js";
import { WEAPONS } from "./data/weapons.js";

export const COMMAND_NAMES = {
	BAN_MULTIPLE_WEAPONS: "mhr_ban",
	// BAN_WEAPON: "mhr_ban_single",
	UNBAN_ALL_WEAPONS: "mhr_unban_all",
	LIST_USER_BANNED_WEAPONS: "mhr_list",
	GET_RANDOM_WEAPON: "mhr_rnd",
	GET_2_RANDOM_WEAPONS: "mhr_r2",
	GET_MULTI_RANDOM_WEAPONS: "mhr_rndx",
	GET_RANDOM_WEAPON_FROM_FAV: "mhr_rnd_fav",
	GET_MULTI_RANDOM_WEAPONS_FROM_FAV: "mhr_rndx_fav",

	USER_SUMMARY: "mhr_user_summary",
	SET_MAIN_WEAPON: "mhr_set_main",
	FAVORITE_WEAPONS: "mhr_set_fav",
	USER_RESET: "mhr_user_reset_stats",

	GET_SERVER_WEAPON_DRAW_STATS: "mhr_stats_server_draws",
	GET_SERVER_WEAPON_BAN_STATS: "mhr_stats_server_bans",
	GET_SERVER_WEAPON_POPULARITY_STATS: "mhr_stats_server_popularity",
	GET_SERVER_WEAPON_MAIN_STATS: "mhr_stats_server_mains",

	CREATE_PARTY: "mhr_create_party",

	HELP: "mhr_help",
} as const;

const createWeaponChoices = () => {
	const choices = Object.keys(WEAPONS);
	const commandChoices = [];

	for (let choice of choices) {
		commandChoices.push({
			name: WEAPONS[choice],
			value: choice,
		});
	}

	return commandChoices;
};

const LIST_USER_BANNED_WEAPONS = {
	name: COMMAND_NAMES.LIST_USER_BANNED_WEAPONS,
	description: "List your banned weapons",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

// const BAN_WEAPON = {
// 	name: COMMAND_NAMES.BAN_WEAPON,
// 	description: "Ban a weapon",
// 	options: [
// 		{
// 			type: 3,
// 			name: "weapon",
// 			description: "Weapon to ban",
// 			required: true,
// 			choices: createWeaponChoices(),
// 		},
// 	],
// 	type: 1,
// 	integration_types: [0, 1],
// 	contexts: [0, 1, 2],
// };

const BAN_MULTIPLE_WEAPONS = {
	name: COMMAND_NAMES.BAN_MULTIPLE_WEAPONS,
	description: "Ban multiple weapons",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const UNBAN_ALL_WEAPONS = {
	name: COMMAND_NAMES.UNBAN_ALL_WEAPONS,
	description: "Unban all weapons",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const GET_RANDOM_WEAPON = {
	name: COMMAND_NAMES.GET_RANDOM_WEAPON,
	description: "Get a random weapon",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const GET_2_RANDOM_WEAPONS = {
	name: COMMAND_NAMES.GET_2_RANDOM_WEAPONS,
	description: "Get 2 random weapons. One on you, and one for the Seikret !",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const GET_MULTI_RANDOM_WEAPONS = {
	name: COMMAND_NAMES.GET_MULTI_RANDOM_WEAPONS,
	description: "Get multiple random weapons",
	options: [
		{
			type: 4,
			name: "number",
			description: "Number of weapons to get",
			required: true,
		},
	],
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const GET_RANDOM_WEAPON_FROM_FAV = {
	name: COMMAND_NAMES.GET_RANDOM_WEAPON_FROM_FAV,
	description: "Get a random weapon from your favorites",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const GET_MULTI_RANDOM_WEAPONS_FROM_FAV = {
	name: COMMAND_NAMES.GET_MULTI_RANDOM_WEAPONS_FROM_FAV,
	description: "Get multiple random weapons from your favorites",
	options: [
		{
			type: 4,
			name: "number",
			description: "Number of weapons to get",
			required: true,
		},
	],
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const FAVORITE_WEAPONS = {
	name: COMMAND_NAMES.FAVORITE_WEAPONS,
	description: "Set your favorite weapons",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const SET_MAIN_WEAPON = {
	name: COMMAND_NAMES.SET_MAIN_WEAPON,
	description: "Set your main weapon",
	options: [
		{
			type: 3,
			name: "weapon",
			description: "Main weapon",
			required: true,
			choices: createWeaponChoices(),
		},
	],
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const USER_SUMMARY = {
	name: COMMAND_NAMES.USER_SUMMARY,
	description: "Get your user summary",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const USER_RESET = {
	name: COMMAND_NAMES.USER_RESET,
	description: "Reset your stats - THIS CANNOT BE UNDONE",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

/**
 * Stats COMMANDS
 */
const GET_SERVER_WEAPON_DRAW_STATS = {
	name: COMMAND_NAMES.GET_SERVER_WEAPON_DRAW_STATS,
	description: "Get weapon draw stats for server",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const GET_SERVER_WEAPON_BAN_STATS = {
	name: COMMAND_NAMES.GET_SERVER_WEAPON_BAN_STATS,
	description: "Get server weapon ban stats",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const GET_SERVER_WEAPON_POPULARITY_STATS = {
	name: COMMAND_NAMES.GET_SERVER_WEAPON_POPULARITY_STATS,
	description: "Get server weapon popularity stats (from favorites)",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const GET_SERVER_WEAPON_MAIN_STATS = {
	name: COMMAND_NAMES.GET_SERVER_WEAPON_MAIN_STATS,
	description: "Get disparity between main weapons in the server",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

/**
 * PARTY COMMANDS
 */
// const CREATE_PARTY = {
//   name: COMMAND_NAMES.CREATE_PARTY,
//   description: "Create a party",
//   type: 1,
//   integration_types: [0, 1],
//   contexts: [0, 1, 2],
// }

const HELP = {
	name: COMMAND_NAMES.HELP,
	description: "Get help",
	type: 1,
	integration_types: [0, 1],
	contexts: [0, 1, 2],
};

const ALL_COMMANDS = [
	LIST_USER_BANNED_WEAPONS,
	BAN_MULTIPLE_WEAPONS,
	// BAN_WEAPON,
	UNBAN_ALL_WEAPONS,
	GET_RANDOM_WEAPON,
	GET_2_RANDOM_WEAPONS,
	GET_MULTI_RANDOM_WEAPONS,
	GET_RANDOM_WEAPON_FROM_FAV,
	GET_MULTI_RANDOM_WEAPONS_FROM_FAV,
	FAVORITE_WEAPONS,
	SET_MAIN_WEAPON,

	USER_SUMMARY,
	// USER_RESET,

	GET_SERVER_WEAPON_DRAW_STATS,
	GET_SERVER_WEAPON_BAN_STATS,
	GET_SERVER_WEAPON_POPULARITY_STATS,
	GET_SERVER_WEAPON_MAIN_STATS,

	// CREATE_PARTY,

	HELP,
];

InstallGlobalCommands(process.env.APP_ID as string, ALL_COMMANDS);
