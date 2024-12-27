import { Request, Response, NextFunction } from "express";
import BadRequestError from "../errors/BadRequestError";

type ErrorResponse = {
	success: Boolean;
	message: string;
	stack?: string;
};

export const errorHandlerMiddleware = (
	err: BadRequestError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const error_response: ErrorResponse = {
		success: false,
		message: err.message,
	};
	if (process.env.NODE_ENV === "development")
		error_response.stack = err.stack;
	res.status(err.statusCode).json(error_response);
};

export default errorHandlerMiddleware;
