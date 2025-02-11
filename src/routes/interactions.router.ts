import { verifyKeyMiddleware } from "discord-interactions";
import { Router } from "express";
import { handleInteractions } from "../controllers/interactions.controller";
const r = Router();

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
r.post(
	"/",
	verifyKeyMiddleware(process.env.PUBLIC_KEY as string),

	//@ts-ignore IDK why TS is complaining about this
	handleInteractions
);

export default r;
