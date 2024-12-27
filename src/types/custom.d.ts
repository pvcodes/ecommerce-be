declare namespace Express {
	export interface Request {
		user?: any;
	}
	export interface Response {
		locals: Record<string, any>; // TODO: https-code module can be used for more abstraction
	}
}
