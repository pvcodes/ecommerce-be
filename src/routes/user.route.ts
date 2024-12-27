import { Router } from "express";
import { adminAuthMiddleware, authMiddleware } from "../middleware/auth";
import userController from "../controllers/user.controller";

const router = Router();

router.post("/register", userController.registerNewUser);
router.post("/login", userController.getUserToken);
router.put(
	"/grant-admin-access",
	adminAuthMiddleware,
	userController.makeAdmin
);

export default router;
