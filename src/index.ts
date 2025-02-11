import dotenv from "dotenv";

dotenv.config();

import { setupExpress } from "./app.js";
import mongoose from "mongoose";

const gracefulShutdown = async () => {
	await mongoose.connection.close();
	console.log("Shutting down");
	process.exit(0);
};

const start = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI as string);
	} catch (error) {
		console.error("Error connecting to the database", error);
	}

	setupExpress();
};

start();

// Graceful shutdown
process.on("SIGINT", gracefulShutdown);
