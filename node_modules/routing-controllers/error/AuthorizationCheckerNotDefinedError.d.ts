import { InternalServerError } from "../http-error/InternalServerError";
/**
 * Thrown when authorizationChecker function is not defined in routing-controllers options.
 */
export declare class AuthorizationCheckerNotDefinedError extends InternalServerError {
    name: string;
    constructor();
}
