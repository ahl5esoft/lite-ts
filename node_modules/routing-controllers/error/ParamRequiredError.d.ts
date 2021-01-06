import { BadRequestError } from "../http-error/BadRequestError";
import { ParamMetadata } from "../metadata/ParamMetadata";
import { Action } from "../Action";
/**
 * Thrown when parameter is required, but was missing in a user request.
 */
export declare class ParamRequiredError extends BadRequestError {
    name: string;
    constructor(action: Action, param: ParamMetadata);
}
