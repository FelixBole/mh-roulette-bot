import mongoose from "mongoose";

export interface IUser {
	user_id: string;
	banned_weapons: string[];
	favorite_weapons: string[];
	main_weapon: string;

	/**
	 * Keep track of the servers the user is in to be able
	 * to provide server-specific stats in the future.
	 */
	servers: string[];

	/**
	 * Keep track of the amount of times a user has been assigned
	 * a weapon to use by the bot.
	 */
	weapon_stats: {
		GS: number;
		LS: number;
		SnS: number;
		DB: number;
		Hammer: number;
		HH: number;
		Lance: number;
		GL: number;
		SA: number;
		CB: number;
		IG: number;
		Bow: number;
		LBG: number;
		HBG: number;
	};
}

const userSchema = new mongoose.Schema<IUser>({
	user_id: {
		type: String,
		required: true,
		unique: true,
	},
	banned_weapons: {
		type: [String],
		default: [],
	},
	favorite_weapons: {
		type: [String],
		default: [],
	},
	main_weapon: { type: String, default: "" },
	servers: { type: [String], default: [] },
	weapon_stats: {
		GS: { type: Number, default: 0 },
		LS: { type: Number, default: 0 },
		SnS: { type: Number, default: 0 },
		DB: { type: Number, default: 0 },
		Hammer: { type: Number, default: 0 },
		HH: { type: Number, default: 0 },
		Lance: { type: Number, default: 0 },
		GL: { type: Number, default: 0 },
		SA: { type: Number, default: 0 },
		CB: { type: Number, default: 0 },
		IG: { type: Number, default: 0 },
		Bow: { type: Number, default: 0 },
		LBG: { type: Number, default: 0 },
		HBG: { type: Number, default: 0 },
	},
});

export const User = mongoose.model("User", userSchema);
