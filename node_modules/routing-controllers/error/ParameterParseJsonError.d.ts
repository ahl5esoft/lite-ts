import { BadRequestError } from "../http-error/BadRequestError";
/**
 * Caused when user parameter is invalid json string and cannot be parsed.
 */
export declare class ParameterParseJsonError extends BadRequestError {
    name: string;
    constructor(parameterName: string, value: any);
}
