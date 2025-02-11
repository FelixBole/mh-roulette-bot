"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_interactions_1 = require("discord-interactions");
const express_1 = require("express");
const interactions_controller_1 = require("../controllers/interactions.controller");
const r = (0, express_1.Router)();
/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
r.post("/", (0, discord_interactions_1.verifyKeyMiddleware)(process.env.PUBLIC_KEY), 
//@ts-ignore IDK why TS is complaining about this
interactions_controller_1.handleInteractions);
exports.default = r;
