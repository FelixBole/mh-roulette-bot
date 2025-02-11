import {
	InteractionResponseType,
	InteractionType,
	MessageComponentTypes,
} from "discord-interactions";
import { Request, Response, NextFunction } from "express";
import { COMMAND_NAMES } from "../commands";
import {
	generateHelpResponse,
	generateMultiWeaponBanResponse,
	generateMultiWeaponFavoriteResponse,
	generateRandomWeaponResponse,
	generateUserRecap,
} from "../helpers/commandResponses";
import {
	getUserWeaponDrawAmount,
	getUserWeaponDrawRate,
	setUserBans,
	tryAddServerToUser,
	tryGetUser,
	updateUserMultipleWeaponStats,
	updateUserWeaponStats,
} from "../helpers/users";
import {
	getRandomWeaponForUser,
	getRandomWeaponFromUserFavorites,
} from "../helpers/randomizer";
import { validateWeaponShort } from "../validators";
import { IUser } from "../models/User.model";
import { HydratedDocument } from "mongoose";
import { getWeaponEmojiShortcode } from "../constants/emoji.constants";

/**
 * Handles all interactions with the bot
 */
export const handleInteractions = async (
	req: Request,
	res: Response,
	_: NextFunction
) => {
	const { type, data, guild, context, member } = req.body;
	const guildId = context === 0 ? guild.id : null;
	const { global_name } = context === 0 ? member?.user : req.body.user;

	if (type === InteractionType.PING) {
		return res.send({ type: InteractionResponseType.PONG });
	}

	if (type === InteractionType.MESSAGE_COMPONENT) {
		const componentId = data.custom_id;

		if (componentId.startsWith("weapon_select_ban_")) {
			const userId = componentId.split("_")[3];
			const user = await tryAddServerToUser(userId, guildId);

			const selectedWeapons = data.values;

			await setUserBans(userId, selectedWeapons, user);

			try {
				return res.send({
					type: InteractionResponseType.UPDATE_MESSAGE, // Updates the original message directly
					data: {
						content: `Banned weapons: ${selectedWeapons
							.map((w: string) => `${getWeaponEmojiShortcode(w)} ${w}`)
							.join(" | ")}`,
						components: [], // Remove the select component
					},
				});
			} catch (err) {
				console.error(err);
			}
		}

		if (componentId.startsWith("weapon_select_favorite_")) {
			const userId = componentId.split("_")[3];
			const user = await tryAddServerToUser(userId, guildId);

			const selectedWeapons = data.values;

			user.favorite_weapons = selectedWeapons;
			await user.save();

			try {
				return res.send({
					type: InteractionResponseType.UPDATE_MESSAGE,
					data: {
						content: `Favorite weapons: ${selectedWeapons
							.map((w: string) => `${getWeaponEmojiShortcode(w)} ${w}`)
							.join(" | ")}`,
						components: [],
					},
				});
			} catch (err) {
				console.error(err);
			}
		}

		return;
	}

	/**
	 * Handle slash command requests
	 */
	if (type === InteractionType.APPLICATION_COMMAND) {
		const { name } = data;
		const context = req.body.context;
		const userId = context === 0 ? req.body.member.user.id : req.body.user.id;

		if (name === COMMAND_NAMES.BAN_MULTIPLE_WEAPONS) {
			return res.send(generateMultiWeaponBanResponse(userId));
		}

		if (name === COMMAND_NAMES.FAVORITE_WEAPONS) {
			return res.send(generateMultiWeaponFavoriteResponse(userId));
		}

		if (name === COMMAND_NAMES.HELP) {
			return res.send(generateHelpResponse());
		}

		// After this point every command needs to know the user

		const user = await tryGetUser(userId);
		if (guildId && !user.servers.includes(guildId)) {
			user.servers.push(guildId);
			await user.save();
		}

		if (name === COMMAND_NAMES.LIST_USER_BANNED_WEAPONS)
			return handleListUserBannedWeapons(res, user);

		if (name === COMMAND_NAMES.UNBAN_ALL_WEAPONS)
			return handleUnbanAllWeapons(res, userId, user);

		if (name === COMMAND_NAMES.SET_MAIN_WEAPON)
			return handleSetMainWeapon(res, data, user);

		if (name === COMMAND_NAMES.GET_RANDOM_WEAPON)
			return handleGetRandomWeapon(res, userId, user);

		if (name === COMMAND_NAMES.GET_MULTI_RANDOM_WEAPONS)
			return handleGetMultiRandomWeapons(res, data, user);

		if (name === COMMAND_NAMES.USER_SUMMARY)
			return res.send(generateUserRecap(user, global_name));

		if (name === COMMAND_NAMES.GET_RANDOM_WEAPON_FROM_FAV)
			return handleGetRandomWeaponFromFavorites(res, userId, user);

		if (name === COMMAND_NAMES.GET_MULTI_RANDOM_WEAPONS_FROM_FAV)
			return handleGetMultiRandomWeaponsFromFavorites(res, data, user);

		console.error(`unknown command: ${name}`);
		return res.status(400).json({ error: "unknown command" });
	}

	console.error("unknown interaction type", type);
	return res.status(400).json({ error: "unknown interaction type" });
};

const handleGetRandomWeapon = async (
	res: Response,
	userId: string,
	user: HydratedDocument<IUser>
) => {
	const weapon = getRandomWeaponForUser(user);
	const updatedUser = await updateUserWeaponStats(userId, weapon, user);
	const drawAmount = getUserWeaponDrawAmount(updatedUser, weapon);
	const drawRate = getUserWeaponDrawRate(updatedUser, weapon);
	return res.send(generateRandomWeaponResponse(weapon, drawAmount, drawRate));
};

const handleGetRandomWeaponFromFavorites = async (
	res: Response,
	userId: string,
	user: HydratedDocument<IUser>
) => {
	if (user.favorite_weapons.length === 0) {
		return res.send({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `You have no favorite weapons`,
			},
		});
	}
	
	const weapon = getRandomWeaponFromUserFavorites(user);
	const updatedUser = await updateUserWeaponStats(userId, weapon, user);
	const drawAmount = getUserWeaponDrawAmount(updatedUser, weapon);
	const drawRate = getUserWeaponDrawRate(updatedUser, weapon);
	return res.send(generateRandomWeaponResponse(weapon, drawAmount, drawRate));
};

const handleGetMultiRandomWeaponsFromFavorites = async (
	res: Response,
	data: any,
	user: HydratedDocument<IUser>
) => {
	if (user.favorite_weapons.length === 0) {
		return res.send({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `You have no favorite weapons`,
			},
		});
	}

	const number = data.options[0].value;
	const weapons = Array.from({ length: number }, () =>
		getRandomWeaponFromUserFavorites(user)
	);

	await updateUserMultipleWeaponStats(user.id, weapons, user);

	return res.send({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: `Random weapons: ${weapons
				.map((w) => `${getWeaponEmojiShortcode(w)} ${w}`)
				.join(" | ")}`,
		},
	});
}

const handleListUserBannedWeapons = async (
	res: Response,
	user: HydratedDocument<IUser>
) => {
	const userBannedWeapons = user.banned_weapons;

	const content =
		userBannedWeapons.length === 0
			? "No banned weapons"
			: `Banned weapons: ${userBannedWeapons.join(", ")}`;

	return res.send({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content,
		},
	});
};

const handleUnbanAllWeapons = async (
	res: Response,
	userId: string,
	user: HydratedDocument<IUser>
) => {
	await setUserBans(userId, [], user);

	return res.send({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: `Unbanned all weapons`,
		},
	});
};

const handleSetMainWeapon = async (
	res: Response,
	data: any,
	user: HydratedDocument<IUser>
) => {
	const weapon = data.options[0].value;
	if (!validateWeaponShort(weapon)) {
		return res.send({
			type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
			data: {
				content: `Invalid weapon: ${weapon}`,
			},
		});
	}

	user.main_weapon = weapon;
	await user.save();

	return res.send({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: `Set main weapon to ${weapon}`,
		},
	});
};

const handleGetMultiRandomWeapons = async (
	res: Response,
	data: any,
	user: HydratedDocument<IUser>
) => {
	const number = data.options[0].value;
	const weapons = Array.from({ length: number }, () =>
		getRandomWeaponForUser(user)
	);

	await updateUserMultipleWeaponStats(user.id, weapons, user);

	return res.send({
		type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		data: {
			content: `Random weapons: ${weapons
				.map((w) => `${getWeaponEmojiShortcode(w)} ${w}`)
				.join(" | ")}`,
		},
	});
};
