import {
	InteractionResponseFlags,
	InteractionResponseType,
	MessageComponentTypes,
} from "discord-interactions";
import { WEAPONS } from "../data/weapons";
import { COMMAND_NAMES } from "../commands";
import { IUser } from "../models/User.model";
import {
	getWeaponEmojiShortcode,
	WEAPON_EMOJIS,
} from "../constants/emoji.constants";
import { getUserWeaponDrawRate } from "./users";

/**
 * Generates the discord response for the multi weapon ban prompt
 * @param userId The Discord ID of the user making the command
 */
export const generateMultiWeaponBanResponse = (userId: string) => {
	return {
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: "Select weapons to ban",
			components: [
				{
					type: MessageComponentTypes.ACTION_ROW,
					components: [
						{
							type: MessageComponentTypes.STRING_SELECT,
							custom_id: `weapon_select_ban${userId}`,
							options: Object.keys(WEAPONS).map((weapon) => ({
								label: `${weapon} - ${WEAPONS[weapon]}`,
								value: weapon,
							})),
							placeholder: "Select weapons to ban",
							min_values: 1,
							max_values: Object.keys(WEAPONS).length,
						},
					],
				},
			],
			flags: InteractionResponseFlags.EPHEMERAL, // Hide from other users
		},
	};
};

/**
 * Generates the discord response for the multi weapon favorite prompt
 * @param userId The Discord ID of the user making the command
 */
export const generateMultiWeaponFavoriteResponse = (userId: string) => {
	return {
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: "Select favorite weapons",
			components: [
				{
					type: MessageComponentTypes.ACTION_ROW,
					components: [
						{
							type: MessageComponentTypes.STRING_SELECT,
							custom_id: `weapon_select_favorite_${userId}`,
							options: Object.keys(WEAPONS).map((weapon) => ({
								label: `${weapon} - ${WEAPONS[weapon]}`,
								value: weapon,
								emoji: {
									name: weapon,
									id: WEAPON_EMOJIS[weapon],
								},
							})),
							placeholder: "Select favorite weapons",
							min_values: 1,
							max_values: Object.keys(WEAPONS).length,
						},
					],
				},
			],
			flags: InteractionResponseFlags.EPHEMERAL,
		},
	};
};

/**
 * Generates the discord response for the random weapon command
 *
 * @param weapon The weapon to display
 * @returns the formatted response
 */
export const generateRandomWeaponResponse = (
	weapon: string,
	draws: number,
	drawRate: string
) => {
	return {
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			embeds: [
				{
					title: `${getWeaponEmojiShortcode(weapon)} ${WEAPONS[weapon]}`,
					color: 0x6fa8dc,
					description: `You got this weapon ${draws} time(s)`,
					footer: {
						text: `Your draw rate for this weapon is ${drawRate}`,
					},
				},
			],
		},
	};
};

/**
 * Generates the discord response for the user recap command
 *
 * @param user The user object
 * @param userName The user's Discord username
 * @returns the formatted response
 */
export const generateUserRecap = (user: IUser, userName: string) => {
	return {
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			embeds: [
				{
					title: `Recap - ${userName}`,
					color: 0x6fa8dc,
					fields: [
						{
							name: "Main Weapon",
							value: user.main_weapon
								? `<:${user.main_weapon}:${WEAPON_EMOJIS[user.main_weapon]}> ${
										user.main_weapon
								  }`
								: "None",
							inline: true,
						},
						{
							name: "Favorite Weapons",
							value:
								user.favorite_weapons.length > 0
									? user.favorite_weapons
											.map((w) => `<:${w}:${WEAPON_EMOJIS[w]}> ${w}`)
											.join(" | ")
									: "None",
							inline: true,
						},
						{
							name: "Banned Weapons",
							value:
								user.banned_weapons.length > 0
									? user.banned_weapons
											.map((w) => `<:${w}:${WEAPON_EMOJIS[w]}> ${w}`)
											.join(" | ")
									: "None",
							inline: true,
						},
						{
							name: "Weapon Stats",
							value: Object.keys(user.weapon_stats)
								.map(
									(weapon) =>
										`${getWeaponEmojiShortcode(weapon)} **${weapon}**: ${
											user.weapon_stats[
												weapon as keyof typeof user.weapon_stats
											]
										} • *${getUserWeaponDrawRate(user, weapon)}*`
								)
								.join("\n"),
							inline: false,
						},
					],
				},
			],
		},
	};
};

/**
 * Generates the discord response for the help command
 */
export const generateHelpResponse = () => {
	return {
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: `**MH Roulette** Helpdesk

**Randomizer**
- \`/${COMMAND_NAMES.GET_RANDOM_WEAPON}\`: Get a random weapon
- \`/${COMMAND_NAMES.GET_MULTI_RANDOM_WEAPONS}\`: Get multiple random weapons
*note: This will add all weapons drawned to your stats*
- \`/${COMMAND_NAMES.GET_RANDOM_WEAPON_FROM_FAV}\`: Get a random weapon from your favorites
- \`/${COMMAND_NAMES.GET_MULTI_RANDOM_WEAPONS_FROM_FAV}\`: Get multiple random weapons from your favorites
*note: This will add all weapons drawned to your stats*

**Banning Weapons**
- \`/${COMMAND_NAMES.BAN_MULTIPLE_WEAPONS}\`: Set your banned weapons
- \`/${COMMAND_NAMES.BAN_WEAPON}\`: Add a banned weapon to your banned list
- \`/${COMMAND_NAMES.LIST_USER_BANNED_WEAPONS}\`: List your banned weapons
- \`/${COMMAND_NAMES.UNBAN_ALL_WEAPONS}\`: Unban all weapons

**User Profile Commands**
- \`/${COMMAND_NAMES.USER_SUMMARY}\`: Get a summary of your stats
- \`/${COMMAND_NAMES.SET_MAIN_WEAPON}\`: Set your main weapon
- \`/${COMMAND_NAMES.FAVORITE_WEAPONS}\`: Set your favorite weapons

**Other**
- \`/${COMMAND_NAMES.HELP}\`: Show this message`,
			flags: InteractionResponseFlags.EPHEMERAL,
		},
	};
};
