import { ParamOptions } from "../decorator-options/ParamOptions";
/**
 * Injects a Session object property to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export declare function SessionParam(propertyName: string, options?: ParamOptions): ParameterDecorator;
