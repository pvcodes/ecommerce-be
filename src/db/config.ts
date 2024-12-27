import dotenv from "dotenv";
dotenv.config();

export const dbConnection = {
	url: process.env.MONGO_URI as string,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
};
