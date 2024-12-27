import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request } from "express";
import BadRequestError from "../errors/BadRequestError";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || "pranjal";

const createJWTToken = async (userDetails: Record<string, any> | string) => {
	if (typeof userDetails === "object") {
		userDetails = JSON.stringify(userDetails);
	}
	return jwt.sign(userDetails, JWT_PRIVATE_KEY);
};

const hash = async (data: Record<string, any> | string) => {
	if (typeof data === "object") {
		data = JSON.stringify(data);
	}
	return bcrypt.hash(data, 10);
};

const validateHash = async (
	data: Record<string, any> | string,
	hashedValue: string
) => {
	if (typeof data === "object") {
		data = JSON.stringify(data);
	}
	return bcrypt.compare(data, hashedValue);
};

const verifyJWTToken = (req: Request, next: NextFunction) => {
	const token = req.headers?.["x-token"] as string | null;
	console.log({ token });

	if (!token) {
		return next(
			new BadRequestError({
				code: 400,
				message: "Token is required!",
				logging: true,
			})
		);
	}

	try {
		const decodedToken = jwt.verify(token, JWT_PRIVATE_KEY);
		console.log({ decodedToken });
		req.user = decodedToken;
		return decodedToken;
	} catch (error) {
		next(
			new BadRequestError({
				code: 400,
				message: "invalid token",
				logging: true,
			})
		);
		return null;
	}
};

export { createJWTToken, hash, validateHash, verifyJWTToken };
