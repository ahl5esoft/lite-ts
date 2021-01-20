import { BadRequestError } from "../http-error/BadRequestError";
/**
 * Caused when user query parameter is invalid (cannot be parsed into selected type).
 */
export declare class InvalidParamError extends BadRequestError {
    name: string;
    constructor(value: any, parameterName: string, parameterType: string);
}
