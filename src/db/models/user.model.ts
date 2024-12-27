import { model, Schema, Document } from "mongoose";
import { User } from "../../interfaces/user.interface";

const userSchema: Schema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

const userModel = model<User & Document>("User", userSchema);

export default userModel;
