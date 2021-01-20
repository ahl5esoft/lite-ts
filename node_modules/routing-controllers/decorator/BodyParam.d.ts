import { ParamOptions } from "../decorator-options/ParamOptions";
/**
 * Takes partial data of the request body.
 * Must be applied on a controller action parameter.
 */
export declare function BodyParam(name: string, options?: ParamOptions): Function;
