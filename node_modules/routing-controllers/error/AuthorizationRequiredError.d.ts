import { Action } from "../Action";
import { UnauthorizedError } from "../http-error/UnauthorizedError";
/**
 * Thrown when authorization is required thought @CurrentUser decorator.
 */
export declare class AuthorizationRequiredError extends UnauthorizedError {
    name: string;
    constructor(action: Action);
}
