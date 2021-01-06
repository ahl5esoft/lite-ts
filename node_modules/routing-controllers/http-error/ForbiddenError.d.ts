import { HttpError } from "./HttpError";
/**
 * Exception for 403 HTTP error.
 */
export declare class ForbiddenError extends HttpError {
    name: string;
    constructor(message?: string);
}
