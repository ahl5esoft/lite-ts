import { Action } from "../Action";
/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export declare function UseInterceptor(...interceptors: Array<Function>): Function;
/**
 * Specifies a given interceptor middleware or interceptor function to be used for controller or controller action.
 * Must be set to controller action or controller class.
 */
export declare function UseInterceptor(...interceptors: Array<(action: Action, result: any) => any>): Function;
