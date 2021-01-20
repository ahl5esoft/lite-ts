import { HttpError } from "./HttpError";
/**
 * Exception for 401 HTTP error.
 */
export declare class UnauthorizedError extends HttpError {
    name: string;
    constructor(message?: string);
}
