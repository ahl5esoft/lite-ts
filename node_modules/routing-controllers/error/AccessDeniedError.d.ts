import { Action } from "../Action";
import { ForbiddenError } from "../http-error/ForbiddenError";
/**
 * Thrown when route is guarded by @Authorized decorator.
 */
export declare class AccessDeniedError extends ForbiddenError {
    name: string;
    constructor(action: Action);
}
