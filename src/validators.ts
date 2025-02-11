export const POSSIBLE_WEAPONS_FULL = [
	"Great Sword",
	"Long Sword",
	"Sword and Shield",
	"Dual Blades",
	"Hammer",
	"Hunting Horn",
	"Lance",
	"Gunlance",
	"Switch Axe",
	"Charge Blade",
	"Insect Glaive",
	"Bow",
	"Light Bowgun",
	"Heavy Bowgun",
] as const;

export const POSSIBLE_WEAPONS_SHORT = [
	"GS",
	"LS",
	"SnS",
	"DB",
	"Hammer",
	"HH",
	"Lance",
	"GL",
	"SA",
	"CB",
	"IG",
	"Bow",
	"LBG",
	"HBG",
] as const;

export const validateWeaponShort = (weapon: string): boolean => {
	return POSSIBLE_WEAPONS_SHORT.includes(weapon as any);
};

export const validateWeaponFull = (weapon: string): boolean => {
	return POSSIBLE_WEAPONS_FULL.includes(weapon as any);
};
