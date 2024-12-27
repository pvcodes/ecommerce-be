import { Request, Response, NextFunction } from "express";

const universalResHandlerMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (res.locals) {
		res.status(res.locals.status || 200).json({
			success: true,
			data: res.locals.data ?? {},
		});
	} else if (!res.headersSent) {
		res.status(404).json({ error: "Not found" });
	} else {
		next(); // If headers are already sent, proceed to the next middleware (e.g., error handlers)
	}
};

export default universalResHandlerMiddleware;
