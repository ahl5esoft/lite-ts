import { HttpError } from "./HttpError";
/**
 * Exception for 500 HTTP error.
 */
export declare class InternalServerError extends HttpError {
    name: string;
    constructor(message: string);
}
