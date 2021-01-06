import { HttpError } from "./HttpError";
/**
 * Exception for todo HTTP error.
 */
export declare class MethodNotAllowedError extends HttpError {
    name: string;
    constructor(message?: string);
}
