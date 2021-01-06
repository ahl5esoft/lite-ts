import { InternalServerError } from "../http-error/InternalServerError";
/**
 * Thrown when currentUserChecker function is not defined in routing-controllers options.
 */
export declare class CurrentUserCheckerNotDefinedError extends InternalServerError {
    name: string;
    constructor();
}
