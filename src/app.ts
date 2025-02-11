import express from "express";
import interactionsRouter from "./routes/interactions.router.js";

export const setupExpress = () => {
	const app = express();
	const PORT = process.env.PORT || 3000;

	app.use("/interactions", interactionsRouter);

	app.listen(PORT, () => {
		console.log("Listening on port", PORT);
	});
};
