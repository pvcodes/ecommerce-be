import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import BadRequestError from "../errors/BadRequestError";
import { verifyJWTToken } from "../utils";
import { User } from "../interfaces/user.interface";

const privateKey = process.env.JWT_PRIVATE_KEY || "pranjal";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
	const decodedToken = verifyJWTToken(req, next);
	if (decodedToken) {
		return next();
	}
}

function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
	const decodedToken = verifyJWTToken(req, next);
	// @ts-ignore
	if (decodedToken && decodedToken?.isAdmin) {
		return next();
	}
	return next(
		new BadRequestError({
			code: 401,
			message: "No Admin privilege",
			logging: true,
		})
	);
}

export { authMiddleware, adminAuthMiddleware };
