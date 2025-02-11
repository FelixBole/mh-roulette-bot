import { User } from "../models/User.model";

export type WeaponStats = {
	weapon: string;
	count: number;
	percentage: number;
};

/**
 * Gets the weapon draw stats for users from a same server
 *
 * @param serverId The server's Discord ID
 * @returns Array containing each weapon's draw count and percentage
 *
 * Example output
 * ```json
 * [{ "weapon": "Bow", "count": 30, "percentage": 50.0 },
 *  { "weapon": "LBG", "count": 20, "percentage": 33.3 },
 *  { "weapon": "CB", "count": 10, "percentage": 16.7 }]
 * ```
 */
export const getServerWeaponDrawStats = async (
	serverId: string
): Promise<WeaponStats[]> => {
	const result = await User.aggregate([
		{ $match: { servers: serverId } },
		{ $project: { weapon_stats: { $objectToArray: "$weapon_stats" } } },
		{ $unwind: "$weapon_stats" },
		{
			$group: {
				_id: "$weapon_stats.k",
				count: { $sum: "$weapon_stats.v" },
			},
		},
		{
			$group: {
				_id: null,
				total: { $sum: "$count" },
				weapons: { $push: { weapon: "$_id", count: "$count" } },
			},
		},
		{ $unwind: "$weapons" },
		{
			$project: {
				_id: 0,
				weapon: "$weapons.weapon",
				count: "$weapons.count",
				percentage: {
					$multiply: [{ $divide: ["$weapons.count", "$total"] }, 100],
				},
			},
		},
		{ $sort: { percentage: -1 } },
	]);

	return result;
};

/**
 * Gets the weapon ban stats for users from a same server
 *
 * @param serverId The server's Discord ID
 * @returns Array containing each weapon's ban count and percentage
 *
 * Example output
 * ```json
 * [{ "weapon": "Bow", "count": 30, "percentage": 50.0 },
 *  { "weapon": "LBG", "count": 20, "percentage": 33.3 },
 *  { "weapon": "CB", "count": 10, "percentage": 16.7 }]
 * ```
 */
export const getServerWeaponBanStats = async (
	serverId: string
): Promise<WeaponStats[]> => {
	const result = await User.aggregate([
		{ $match: { servers: serverId } },
		{ $unwind: "$banned_weapons" },
		{
			$group: {
				_id: "$banned_weapons",
				count: { $sum: 1 },
			},
		},
		{
			$group: {
				_id: null,
				total: { $sum: "$count" },
				weapons: { $push: { weapon: "$_id", count: "$count" } },
			},
		},
		{ $unwind: "$weapons" },
		{
			$project: {
				_id: 0,
				weapon: "$weapons.weapon",
				count: "$weapons.count",
				percentage: {
					$multiply: [{ $divide: ["$weapons.count", "$total"] }, 100],
				},
			},
		},
		{ $sort: { percentage: -1 } },
	]);

	return result;
};

/**
 * Gets the main weapon stats for users from a same server
 *
 * @param serverId The server's Discord ID
 * @returns Array containing each weapon's main weapon count and percentage
 *
 * Example output
 * ```json
 * [{ "weapon": "LS", "count": 50, "percentage": 40.0 },
 * { "weapon": "GS", "count": 30, "percentage": 24.0 },
 * { "weapon": "IG", "count": 20, "percentage": 16.0 }]
 * ```
 */
export const getServerMainWeaponStats = async (
	serverId: string
): Promise<WeaponStats[]> => {
	const result = await User.aggregate([
		{ $match: { servers: serverId, main_weapon: { $ne: "" } } }, // Filter users with a main weapon
		{
			$group: {
				_id: "$main_weapon",
				count: { $sum: 1 },
			},
		},
		{
			$group: {
				_id: null,
				total: { $sum: "$count" },
				weapons: { $push: { weapon: "$_id", count: "$count" } },
			},
		},
		{ $unwind: "$weapons" },
		{
			$project: {
				_id: 0,
				weapon: "$weapons.weapon",
				count: "$weapons.count",
				percentage: {
					$multiply: [{ $divide: ["$weapons.count", "$total"] }, 100],
				},
			},
		},
		{ $sort: { percentage: -1 } },
	]);

	return result;
};

/**
 * Gets the most popular weapons in a server based on users' favorite weapons
 *
 * @param serverId The server's Discord ID
 * @returns Array containing each weapon's count and percentage
 *
 * Example output:
 * ```json
 * [{ "weapon": "LS", "count": 60, "percentage": 42.9 },
 *  { "weapon": "GS", "count": 45, "percentage": 32.1 },
 *  { "weapon": "Bow", "count": 35, "percentage": 25.0 }]
 * ```
 */
export const getServerFavoriteWeaponStats = async (
	serverId: string
): Promise<WeaponStats[]> => {
	const result = await User.aggregate([
		{ $match: { servers: serverId, favorite_weapons: { $ne: [] } } }, // Ensure the user has favorites
		{ $unwind: "$favorite_weapons" },
		{
			$group: {
				_id: "$favorite_weapons",
				count: { $sum: 1 },
			},
		},
		{
			$group: {
				_id: null,
				total: { $sum: "$count" },
				weapons: { $push: { weapon: "$_id", count: "$count" } },
			},
		},
		{ $unwind: "$weapons" },
		{
			$project: {
				_id: 0,
				weapon: "$weapons.weapon",
				count: "$weapons.count",
				percentage: {
					$multiply: [{ $divide: ["$weapons.count", "$total"] }, 100],
				},
			},
		},
		{ $sort: { percentage: -1 } },
	]);

	return result;
};
