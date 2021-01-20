import { HttpError } from "./HttpError";
/**
 * Exception for 404 HTTP error.
 */
export declare class NotFoundError extends HttpError {
    name: string;
    constructor(message?: string);
}
