import { ParamOptions } from "../decorator-options/ParamOptions";
/**
 * Injects a request's cookie value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export declare function CookieParam(name: string, options?: ParamOptions): (object: Object, methodName: string, index: number) => void;
