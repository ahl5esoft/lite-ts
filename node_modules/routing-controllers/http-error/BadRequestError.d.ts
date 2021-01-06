import { HttpError } from "./HttpError";
/**
 * Exception for 400 HTTP error.
 */
export declare class BadRequestError extends HttpError {
    name: string;
    constructor(message?: string);
}
