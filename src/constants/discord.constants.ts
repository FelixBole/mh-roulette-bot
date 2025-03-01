/**
 * @ref https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types
 */
export const DISCORD_INTERACTION_CONTEXT_TYPES = {
	/**
	 * Interaction can be used within servers
	 */
	GUILD: 0,

	/**
	 * Interaction can be used within DMs with the app's bot user
	 */
	BOT_DM: 1,

	/**
	 * Interaction can be used within group DMs & DMs other than the app's bot user
	 */
	PRIVATE_CHANNEL: 2,
};
