import { IUser } from "../models/User.model";
import { getUserPossibleWeapons } from "./users";

export const getRandomWeaponForUser = (user: IUser) => {
	const possibleWeapons = getUserPossibleWeapons(user);
	const randomIndex = Math.floor(Math.random() * possibleWeapons.length);
	return possibleWeapons[randomIndex];
};

export const getRandomWeaponFromUserFavorites = (user: IUser) => {
	const favoriteWeapons = user.favorite_weapons;
	const randomIndex = Math.floor(Math.random() * favoriteWeapons.length);
	return favoriteWeapons[randomIndex];
};
