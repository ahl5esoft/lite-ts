import { ValidatorOptions } from "class-validator";
import { ClassTransformOptions } from "class-transformer";
import { CurrentUserChecker } from "../CurrentUserChecker";
import { AuthorizationChecker } from "../AuthorizationChecker";
import { ActionMetadata } from "../metadata/ActionMetadata";
import { ParamMetadata } from "../metadata/ParamMetadata";
import { MiddlewareMetadata } from "../metadata/MiddlewareMetadata";
import { Action } from "../Action";
/**
 * Base driver functionality for all other drivers.
 * Abstract layer to organize controllers integration with different http server implementations.
 */
export declare abstract class BaseDriver {
    /**
     * Reference to the underlying framework app object.
     */
    app: any;
    /**
     * Indicates if class-transformer should be used or not.
     */
    useClassTransformer: boolean;
    /**
     * Indicates if class-validator should be used or not.
     */
    enableValidation: boolean;
    /**
     * Global class transformer options passed to class-transformer during classToPlain operation.
     * This operation is being executed when server returns response to user.
     */
    classToPlainTransformOptions: ClassTransformOptions;
    /**
     * Global class-validator options passed during validate operation.
     */
    validationOptions: ValidatorOptions;
    /**
     * Global class transformer options passed to class-transformer during plainToClass operation.
     * This operation is being executed when parsing user parameters.
     */
    plainToClassTransformOptions: ClassTransformOptions;
    /**
     * Indicates if default routing-controllers error handler should be used or not.
     */
    isDefaultErrorHandlingEnabled: boolean;
    /**
     * Indicates if routing-controllers should operate in development mode.
     */
    developmentMode: boolean;
    /**
     * Global application prefix.
     */
    routePrefix: string;
    /**
     * Indicates if cors are enabled.
     * This requires installation of additional module (cors for express and kcors for koa).
     */
    cors?: boolean | Object;
    /**
     * Map of error overrides.
     */
    errorOverridingMap: {
        [key: string]: any;
    };
    /**
     * Special function used to check user authorization roles per request.
     * Must return true or promise with boolean true resolved for authorization to succeed.
     */
    authorizationChecker?: AuthorizationChecker;
    /**
     * Special function used to get currently authorized user.
     */
    currentUserChecker?: CurrentUserChecker;
    /**
     * Initializes the things driver needs before routes and middleware registration.
     */
    abstract initialize(): void;
    /**
     * Registers given middleware.
     */
    abstract registerMiddleware(middleware: MiddlewareMetadata): void;
    /**
     * Registers action in the driver.
     */
    abstract registerAction(action: ActionMetadata, executeCallback: (options: Action) => any): void;
    /**
     * Registers all routes in the framework.
     */
    abstract registerRoutes(): void;
    /**
     * Gets param from the request.
     */
    abstract getParamFromRequest(actionOptions: Action, param: ParamMetadata): any;
    /**
     * Defines an algorithm of how to handle error during executing controller action.
     */
    abstract handleError(error: any, action: ActionMetadata, options: Action): any;
    /**
     * Defines an algorithm of how to handle success result of executing controller action.
     */
    abstract handleSuccess(result: any, action: ActionMetadata, options: Action): void;
    protected transformResult(result: any, action: ActionMetadata, options: Action): any;
    protected processJsonError(error: any): any;
    protected processTextError(error: any): any;
    protected merge(obj1: any, obj2: any): any;
}
