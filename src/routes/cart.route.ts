import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import cartController from "../controllers/cart.controller";

const router = Router();

// /cart
router.get("/", authMiddleware, cartController.getCart);
router.post("/", authMiddleware, cartController.addItemToCart);
router.delete("/:id", authMiddleware, cartController.removeItemFromCart);

export default router;