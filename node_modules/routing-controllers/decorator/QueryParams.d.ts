import { ParamOptions } from "../decorator-options/ParamOptions";
/**
 * Injects all request's query parameters to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export declare function QueryParams(options?: ParamOptions): Function;
