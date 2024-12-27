import { model, Schema, Document } from "mongoose";
import { Product } from "../../interfaces/product.interface";

const productSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	inStock: {
		type: Boolean,
		default: true,
	},
});

const productModel = model<Product & Document>("Product", productSchema);

export default productModel;
