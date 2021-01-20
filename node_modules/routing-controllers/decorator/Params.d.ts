import { ParamOptions } from "../decorator-options/ParamOptions";
/**
 * Injects all request's route parameters to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export declare function Params(options?: ParamOptions): Function;
