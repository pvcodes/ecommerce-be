import { productModel } from "../db/models";
import cartModel from "../db/models/cart.model";

class CartService {
	// Retrieve the user's shopping cart
	static async getCart(userId: string) {
		try {
			const cart = await cartModel
				.findOne({ userId })
				.populate("products.productId");
			return cart;
		} catch (error) {
			throw new Error(`Unable to retrieve cart: ${error.message}`);
		}
	}

	// Add an item to the cart
	static async addItemToCart(
		userId: string,
		productId: string,
		quantity: number
	) {
		try {
			const product = await productModel.findById(productId);
			console.log({ product });
			const cart = await cartModel.findOneAndUpdate(
				{ userId, "products.productId": productId },
				{
					$inc: {
						"products.$.quantity": quantity,
						totalPrice: product?.price * quantity,
					},
				},
				{ new: true }
			);

			// If the product is not already in the cart, add it
			if (!cart) {
				return await cartModel.findOneAndUpdate(
					{ userId },
					{
						$push: { products: { productId, quantity } },
						$inc: { totalPrice: product?.price * quantity },
					},
					{ new: true, upsert: true }
				);
			}

			return cart;
		} catch (error) {
			throw new Error(`Unable to add item to cart: ${error.message}`);
		}
	}

	// Remove an item from the cart
	static async removeItemFromCart(
		userId: string,
		productId: string,
		quantity: number | null = null
	) {
		try {
			const product = await productModel.findById(productId);

			const cartDetails = (
				await cartModel.find({ userId }).populate("products.productId")
			)[0];

			let currentQuantity;
			for (const product of cartDetails.products) {
                // @ts-ignore
				if (productId === product.productId._id.toString()) {
					currentQuantity = product.quantity;
				}
			}

			if (quantity === null) {
				quantity = currentQuantity;
			}

			if (currentQuantity <= quantity) {
				// Remove the product if the quantity to remove is equal to or greater than current quantity
				await cartModel.updateOne(
					{ userId },
					{
						$pull: { products: { productId } },
						$inc: {
							totalPrice: -(product?.price * currentQuantity),
						},
					}
				);
			} else {
				// Decrease the product quantity by `quantity`
				await cartModel.updateOne(
					{ userId, "products.productId": productId },
					{
						$inc: {
							"products.$.quantity": -quantity,
							totalPrice: -(product?.price * quantity),
						},
					}
				);
			}

			return await cartModel.findOne({ userId });
		} catch (error) {
			throw new Error(
				`Unable to remove item from cart: ${error.message}`
			);
		}
	}
}

export default CartService;
