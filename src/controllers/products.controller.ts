import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import ProductService from "../services/products.service";
import BadRequestError from "../errors/BadRequestError";

class ProductsController {
	// Define a schema for product creation
	private static productSchema = Joi.object({
		name: Joi.string().required(),
		description: Joi.string().required(),
		price: Joi.number().required(),
		inStock: Joi.boolean(),
	});

    private static updateProductSchema = Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        price: Joi.number(),
        inStock: Joi.boolean(),
    }).min(1);

	// GET /products: Retrieve a list of products
	static async getProducts(req: Request, res: Response, next: NextFunction) {
		//  TODO: add pagination, all products fetched in one could be expensive
		try {
			const products = await ProductService.getProducts();
			res.locals = {
				status: 200,
				data: products,
			};
			return next();
		} catch (error) {
			return next(
				new BadRequestError({
					code: 500,
					message: "Internal Server Error",
					logging: true,
				})
			);
		}
	}

	// GET /products/:id: Retrieve details of a specific product
	static async getProductById(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const { id } = req.params;
			const product = await ProductService.getProductById(id);
			if (!product) {
				return next(
					new BadRequestError({
						code: 404,
						message: "Product not found",
						logging: true,
					})
				);
			}
			res.locals = {
				status: 200,
				data: product,
			};
			return next();
		} catch (error) {
			return next(
				new BadRequestError({
					code: 500,
					message: "Internal Server Error",
					logging: true,
				})
			);
		}
	}

	// POST /products: Add a new product
	static async addProduct(req: Request, res: Response, next: NextFunction) {
		const { error, value: payload } =
			ProductsController.productSchema.validate(req.body);
		if (error) {
			return next(
				new BadRequestError({
					code: 400,
					message: error.details[0].message,
					logging: true,
				})
			);
		}

		try {
			const newProduct = await ProductService.addProduct(payload);
			res.locals = {
				status: 201,
				data: newProduct,
			};
			return next();
		} catch (error) {
			return next(
				new BadRequestError({
					code: 400,
					message: "Unable to add product",
					logging: true,
				})
			);
		}
	}

	// PUT /products/:id: Update an existing product
	static async updateProduct(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { id } = req.params;
		const { error, value: updateData } =
			ProductsController.updateProductSchema.validate(req.body);
		if (error) {
			return next(
				new BadRequestError({
					code: 400,
					message: error.details[0].message,
					logging: true,
				})
			);
		}

		try {
			const updatedProduct = await ProductService.updateProduct(
				id,
				updateData
			);
			if (!updatedProduct) {
				return next(
					new BadRequestError({
						code: 404,
						message: "Product not found",
						logging: true,
					})
				);
			}
			res.locals = {
				status: 200,
				data: updatedProduct,
			};
			return next();
		} catch (error) {
			return next(
				new BadRequestError({
					code: 500,
					message: "Internal Server Error",
					logging: true,
				})
			);
		}
	}

	// DELETE /products/:id: Delete a product
	static async deleteProduct(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const { id } = req.params;
			const deletedProduct = await ProductService.deleteProduct(id);
			if (!deletedProduct) {
				return next(
					new BadRequestError({
						code: 404,
						message: "Product not found",
						logging: true,
					})
				);
			}
			res.locals = {
				status: 200,
				data: deletedProduct,
			};
			return next();
		} catch (error) {
			return next(
				new BadRequestError({
					code: 500,
					message: "Internal Server Error",
					logging: true,
				})
			);
		}
	}
}

export default ProductsController;
