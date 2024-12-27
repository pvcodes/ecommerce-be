import { model, Schema, Document } from "mongoose";
import { Cart } from "../../interfaces/cart.interface";
import productModel from "./product.model";

const cartSchema: Schema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	products: [
		{
			productId: {
				type: Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
				min: 1,
			},
		},
	],
	totalPrice: {
		type: Number,
		required: true,
		default: 0,
	},
});

const cartModel = model<Cart & Document>("Cart", cartSchema);

export default cartModel;
