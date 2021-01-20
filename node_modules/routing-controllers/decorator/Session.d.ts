import { ParamOptions } from "../decorator-options/ParamOptions";
/**
 * Injects a Session object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export declare function Session(options?: ParamOptions): ParameterDecorator;
