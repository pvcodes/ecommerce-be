import productModel from "../db/models/product.model";
import { Product } from "../interfaces/product.interface";

class ProductService {
	// Method to retrieve a list of products
	static async getProducts() {
		try {
			const products = await productModel.find();
			return products;
		} catch (error) {
			throw new Error(`Unable to retrieve products: ${error.message}`);
		}
	}

	// Method to retrieve details of a specific product by id
	static async getProductById(id: string) {
		try {
			const product = await productModel.findById(id);
			if (!product) {
				throw new Error("Product not found");
			}
			return product;
		} catch (error) {
			throw new Error(`Unable to retrieve product: ${error.message}`);
		}
	}

	// Method to add a new product
	static async addProduct(data: Product) {
		try {
			const product = await productModel.create(data);
			return product;
		} catch (error) {
			throw new Error(`Unable to add product: ${error.message}`);
		}
	}

	// Method to update an existing product by id
	static async updateProduct(id: string, updateData: Partial<Product>) {
		try {
			const updatedProduct = await productModel.findByIdAndUpdate(
				id,
				updateData,
				{ new: true }
			);
			if (!updatedProduct) {
				throw new Error("Product not found");
			}
			return updatedProduct;
		} catch (error) {
			throw new Error(`Unable to update product: ${error.message}`);
		}
	}

	// Method to delete a product by id
	static async deleteProduct(id: string) {
		try {
			const deletedProduct = await productModel.findByIdAndDelete(id);
			if (!deletedProduct) {
				throw new Error("Product not found");
			}
			return deletedProduct;
		} catch (error) {
			throw new Error(`Unable to delete product: ${error.message}`);
		}
	}
}

export default ProductService;
