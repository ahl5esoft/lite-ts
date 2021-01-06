/**
 * Specifies a given middleware to be used for controller or controller action AFTER the action executes.
 * Must be set to controller action or controller class.
 */
export declare function UseAfter(...middlewares: Array<Function>): Function;
/**
 * Specifies a given middleware to be used for controller or controller action AFTER the action executes.
 * Must be set to controller action or controller class.
 */
export declare function UseAfter(...middlewares: Array<(context: any, next: () => Promise<any>) => Promise<any>>): Function;
/**
 * Specifies a given middleware to be used for controller or controller action AFTER the action executes.
 * Must be set to controller action or controller class.
 */
export declare function UseAfter(...middlewares: Array<(request: any, response: any, next: Function) => any>): Function;
