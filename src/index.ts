import express, { Express, Request, Response, urlencoded } from "express";
import mongoose, { connect, set, disconnect } from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Import the cors package

import { dbConnection } from "./db/config";
import userRoute from "./routes/user.route";
import productRoute from "./routes/products.route";
import cartRoute from "./routes/cart.route";
import errorHandlerMiddleware from "./middleware/errorHandler";
import universalResHandlerMiddleware from "./middleware/finalResHandler";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);

app.get("/health", async (req: Request, res: Response) => {
	const mongooseStatus =
		["disconnected", "connected", "connecting", "disconnecting"][
			mongoose.connection.readyState
		] || "unknown";

	res.json({
		server: "running",
		mongoose: mongooseStatus,
	});
});

app.use(universalResHandlerMiddleware);
app.use(errorHandlerMiddleware);

app.listen(port, async () => {
	await connect(dbConnection.url);
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
