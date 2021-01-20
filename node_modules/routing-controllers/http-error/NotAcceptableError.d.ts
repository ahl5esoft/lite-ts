import { HttpError } from "./HttpError";
/**
 * Exception for 406 HTTP error.
 */
export declare class NotAcceptableError extends HttpError {
    name: string;
    constructor(message?: string);
}
