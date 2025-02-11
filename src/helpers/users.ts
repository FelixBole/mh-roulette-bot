import { HydratedDocument } from "mongoose";
import { IUser, User } from "../models/User.model";

/**
 * Attempts to get a user from the database or creates one before returning it.
 *
 * @param userId The user's Discord ID
 */
export const tryGetUser = async (userId: string) => {
	return await User.findOneAndUpdate(
		{ user_id: userId },
		{ $setOnInsert: { user_id: userId } },
		{ new: true, upsert: true }
	);
};

/**
 * Adds a server to the user's servers list.
 *
 * @param userId The user's Discord ID
 * @param serverId The server's Discord ID
 * @param foundUser The user if found previously
 */
export const tryAddServerToUser = async (userId: string, serverId: string, foundUser?: HydratedDocument<IUser>) => {
	const user = await tryGetUser(userId);

	if (!user.servers.includes(serverId)) {
		user.servers.push(serverId);
		await user.save();
	}

	return user;
};

/**
 * Removes a server from the user's servers list.
 *
 * @param userId The user's Discord ID
 * @param serverId The server's Discord ID
 * @returns The updated user
 */
export const removeServerFromUser = async (
	userId: string,
	serverId: string
) => {
	const user = await tryGetUser(userId);

	const index = user.servers.indexOf(serverId);
	if (index > -1) {
		user.servers.splice(index, 1);
		await user.save();
	}

	return user;
};

/**
 * Sets the user's banned weapons and saves the user.
 *
 * @param userId The user's Discord ID
 * @param bannedWeapons The banned weapons
 * @param foundUser The user if found previously
 */
export const setUserBans = async (
	userId: string,
	bannedWeapons: string[],
	foundUser?: HydratedDocument<IUser>
) => {
	let user = foundUser || (await tryGetUser(userId));

	user.banned_weapons = bannedWeapons;
	await user.save();
	return user;
};

/**
 * Adds weapons to the user's banned weapons.
 *
 * @param userId The user's Discord ID
 * @param bannedWeapons The banned weapons to add
 */
export const addBannedWeapons = async (
	userId: string,
	bannedWeapons: string[]
) => {
	const user = await tryGetUser(userId);

	user.banned_weapons.push(...bannedWeapons);
	user.banned_weapons = [...new Set(user.banned_weapons)];
	await user.save();
	return user;
};

/**
 * Sets the user's favorite weapons.
 *
 * @param userId The user's Discord ID
 * @param favoriteWeapons The favorite weapons
 */
export const setUserFavorites = async (
	userId: string,
	favoriteWeapons: string[]
) => {
	const user = await tryGetUser(userId);

	user.favorite_weapons = favoriteWeapons;
	user.favorite_weapons = [...new Set(user.favorite_weapons)];
	await user.save();
	return user;
};

/**
 * Sets the user's main weapon.
 *
 * @param userId The user's Discord ID
 * @param mainWeapon The main weapon
 * @returns The updated user
 **/
export const setUserMainWeapon = async (userId: string, mainWeapon: string) => {
	const user = await tryGetUser(userId);

	user.main_weapon = mainWeapon;
	await user.save();
	return user;
};

/**
 * Updates the user's weapon stats.
 *
 * @param userId The user's Discord ID
 * @param weaponDrawn The weapon drawn by the bot for the user
 * @param foundUser The user if found previously
 */
export const updateUserWeaponStats = async (
	userId: string,
	weaponDrawn: string,
    foundUser?: HydratedDocument<IUser>
) => {
	let user = foundUser || await tryGetUser(userId);

	user.weapon_stats[weaponDrawn as keyof typeof user.weapon_stats]++;
	await user.save();

	return user;
};

/**
 * Updates the user's weapon stats for multiple weapons.
 *
 * @param userId The user's Discord ID
 * @param weaponsDrawn The weapons drawn by the bot for the user
 * @param foundUser The user if found previously
 */
export const updateUserMultipleWeaponStats = async (
	userId: string,
	weaponsDrawn: string[],
	foundUser?: HydratedDocument<IUser>
) => {
	let user = foundUser || await tryGetUser(userId);

	weaponsDrawn.forEach(weapon => {
		user.weapon_stats[weapon as keyof typeof user.weapon_stats]++;
	});

	await user.save();

	return user;
};

/**
 * Resets the user's weapon stats.
 *
 * @param userId The user's Discord ID
 */
export const resetUserWeaponStats = async (userId: string) => {
	const user = await tryGetUser(userId);

	user.weapon_stats = {
		GS: 0,
		LS: 0,
		SnS: 0,
		DB: 0,
		Hammer: 0,
		HH: 0,
		Lance: 0,
		GL: 0,
		SA: 0,
		CB: 0,
		IG: 0,
		Bow: 0,
		LBG: 0,
		HBG: 0,
	};

	await user.save();
	return user;
};

/**
 * Get's the possible weapons for a user to draw from.
 *
 * @returns The possible weapons
 */
export const getUserPossibleWeapons = (user: IUser) => {
	const bannedWeapons = user.banned_weapons;
	const possibleWeapons = Object.keys(user.weapon_stats).filter(
		(weapon) => !bannedWeapons.map(w => w.toLowerCase()).includes(weapon.toLowerCase())
	);

	return possibleWeapons;
};

export const getUserWeaponDrawAmount = (user: IUser, weapon: string) => {
	const weaponStats = user.weapon_stats[weapon as keyof typeof user.weapon_stats];
	return weaponStats;
}

/**
 * Gets the draw rate percentage of a specific weapon for a user.
 *
 * @param user The user object
 * @param weapon The weapon to get the draw rate for
 * @returns The draw rate of the weapon as a formatted percentage string
 */
export const getUserWeaponDrawRate = (user: IUser, weapon: string): string => {
    const totalDraws = Object.values(user.weapon_stats).reduce(
        (acc, count) => acc + count,
        0
    );

    const weaponDraws = user.weapon_stats[weapon as keyof typeof user.weapon_stats] || 0;

    const percentage = totalDraws > 0 ? (weaponDraws / totalDraws) * 100 : 0;

    return `${percentage.toFixed(0)}%`;
};
