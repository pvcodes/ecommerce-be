import { Request, Response, NextFunction } from "express";
import CartService from "../services/cart.service";
import BadRequestError from "../errors/BadRequestError";
import Joi from "joi";

class CartController {
	// Define a schema for adding an item to the cart
	private static addItemSchema = Joi.object({
		productId: Joi.string().required(),
		quantity: Joi.number().min(1).required(),
	});

	static async getCart(req: Request, res: Response, next: NextFunction) {
		const userId = req.user.id;

		try {
			const cart = await CartService.getCart(userId);
			res.locals = {
				status: 200,
				data: cart,
			};
			return next();
		} catch (error) {
			return next(
				new BadRequestError({
					code: 400,
					message: "Unable to retrieve cart",
					logging: true,
				})
			);
		}
	}

	static async addItemToCart(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { error, value: payload } = CartController.addItemSchema.validate(
			req.body
		);
		if (error) {
			return next(
				new BadRequestError({
					code: 400,
					message: error.details[0].message,
					logging: true,
				})
			);
		}

		const userId = req.user.id; // Assuming user ID is available in the request object

		try {
			const cart = await CartService.addItemToCart(
				userId,
				payload.productId,
				payload.quantity
			);
			res.locals = {
				status: 200,
				data: cart,
			};
			return next();
		} catch (error) {
			return next(
				new BadRequestError({
					code: 400,
					message: "Unable to add item to cart",
					logging: true,
				})
			);
		}
	}

	static async removeItemFromCart(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const userId = req.user.id; // Assuming user ID is available in the request object
		const productId = req.params.id;
		let quantity: number | null = parseInt(
			req?.query?.quantity as string,
			10
		);
		if (isNaN(quantity)) quantity = null;

		console.log({
			productId,
			quantity,
		});

		try {
			const cart = await CartService.removeItemFromCart(
				userId,
				productId,
				quantity
			);
			res.locals = {
				status: 200,
				data: cart,
			};
			return next();
		} catch (error) {
			return next(
				new BadRequestError({
					code: 400,
					message: "Unable to remove item from cart",
					logging: true,
				})
			);
		}
	}
}

export default CartController;
