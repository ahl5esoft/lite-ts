import { ParamOptions } from "../decorator-options/ParamOptions";
/**
 * Injects a request's http header value to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export declare function HeaderParam(name: string, options?: ParamOptions): Function;
