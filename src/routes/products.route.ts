import { Router } from "express";
import { adminAuthMiddleware, authMiddleware } from "../middleware/auth";
import userController from "../controllers/user.controller";
import productController from "../controllers/products.controller";

const router = Router();

// /products
router.get("/", authMiddleware, productController.getProducts);
router.post("/", adminAuthMiddleware, productController.addProduct);
router.get("/:id", authMiddleware, productController.getProductById);
router.put("/:id", adminAuthMiddleware, productController.updateProduct);
router.delete("/:id", adminAuthMiddleware, productController.deleteProduct);

export default router;
