import { Request, Response, NextFunction } from "express";
import { createJWTToken, hash, validateHash } from "../utils";
import BadRequestError from "../errors/BadRequestError";
import Joi from "joi";
import UserService from "../services/user.service";

class UserController {
	// Define a schema for user registration
	private static registerSchema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
	});

	// Define a schema for user login
	private static loginSchema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	});
	private static makeAdminSchema = Joi.object({
		email: Joi.string().email().required(),
	});

	static async registerNewUser(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const { error, value: payload } =
			UserController.registerSchema.validate(req.body);
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
			const password = await hash(payload.password);
			const user = await UserService.createUser({
				email: payload.email,
				password,
			});
			const token = await createJWTToken({
				id: user._id,
				email: user.email,
				isAdmin: user.isAdmin,
			});
			res.locals = {
				status: 200,
				data: { token },
			};
			return next();
		} catch (error) {
			return next(
				new BadRequestError({
					code: 400,
					message: "User already exists",
					logging: true,
				})
			);
		}
	}

	static async getUserToken(req: Request, res: Response, next: NextFunction) {
		const { error, value: payload } = UserController.loginSchema.validate(
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

		try {
			const user = await UserService.findOneUser({
				email: payload.email,
			});

			if (!user) {
				return next(
					new BadRequestError({
						code: 400,
						message: "User not found",
						logging: true,
					})
				);
			}

			const isPasswordValid = await validateHash(
				payload.password,
				user.password
			);
			if (!isPasswordValid) {
				return next(
					new BadRequestError({
						code: 400,
						message: "Invalid Password",
						logging: true,
					})
				);
			}

			const token = await createJWTToken({
				id: user._id,
				email: user.email,
				isAdmin: user.isAdmin,
			});
			res.locals = {
				status: 200,
				data: { token },
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

	static async makeAdmin(req: Request, res: Response, next: NextFunction) {
		const { error, value: payload } =
			UserController.makeAdminSchema.validate(req.body);
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
			const user = await UserService.updateUser(
				{
					email: payload.email,
				},
				{
					isAdmin: true,
				}
			);
			if (!user) {
				return next(
					new BadRequestError({
						code: 400,
						message: "User not found",
						logging: true,
					})
				);
			}

			res.locals = {
				status: 201,
				data: {
					email: user.email,
				},
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

export default UserController;
