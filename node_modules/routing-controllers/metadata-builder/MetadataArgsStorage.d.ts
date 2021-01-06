import { ControllerMetadataArgs } from "../metadata/args/ControllerMetadataArgs";
import { ActionMetadataArgs } from "../metadata/args/ActionMetadataArgs";
import { ParamMetadataArgs } from "../metadata/args/ParamMetadataArgs";
import { ResponseHandlerMetadataArgs } from "../metadata/args/ResponseHandleMetadataArgs";
import { MiddlewareMetadataArgs } from "../metadata/args/MiddlewareMetadataArgs";
import { UseMetadataArgs } from "../metadata/args/UseMetadataArgs";
import { UseInterceptorMetadataArgs } from "../metadata/args/UseInterceptorMetadataArgs";
import { InterceptorMetadataArgs } from "../metadata/args/InterceptorMetadataArgs";
/**
 * Storage all metadatas read from decorators.
 */
export declare class MetadataArgsStorage {
    /**
     * Registered controller metadata args.
     */
    controllers: ControllerMetadataArgs[];
    /**
     * Registered middleware metadata args.
     */
    middlewares: MiddlewareMetadataArgs[];
    /**
     * Registered interceptor metadata args.
     */
    interceptors: InterceptorMetadataArgs[];
    /**
     * Registered "use middleware" metadata args.
     */
    uses: UseMetadataArgs[];
    /**
     * Registered "use interceptor" metadata args.
     */
    useInterceptors: UseInterceptorMetadataArgs[];
    /**
     * Registered action metadata args.
     */
    actions: ActionMetadataArgs[];
    /**
     * Registered param metadata args.
     */
    params: ParamMetadataArgs[];
    /**
     * Registered response handler metadata args.
     */
    responseHandlers: ResponseHandlerMetadataArgs[];
    /**
     * Filters registered middlewares by a given classes.
     */
    filterMiddlewareMetadatasForClasses(classes: Function[]): MiddlewareMetadataArgs[];
    /**
     * Filters registered interceptors by a given classes.
     */
    filterInterceptorMetadatasForClasses(classes: Function[]): InterceptorMetadataArgs[];
    /**
     * Filters registered controllers by a given classes.
     */
    filterControllerMetadatasForClasses(classes: Function[]): ControllerMetadataArgs[];
    /**
     * Filters registered actions by a given classes.
     */
    filterActionsWithTarget(target: Function): ActionMetadataArgs[];
    /**
     * Filters registered "use middlewares" by a given target class and method name.
     */
    filterUsesWithTargetAndMethod(target: Function, methodName: string): UseMetadataArgs[];
    /**
     * Filters registered "use interceptors" by a given target class and method name.
     */
    filterInterceptorUsesWithTargetAndMethod(target: Function, methodName: string): UseInterceptorMetadataArgs[];
    /**
     * Filters parameters by a given classes.
     */
    filterParamsWithTargetAndMethod(target: Function, methodName: string): ParamMetadataArgs[];
    /**
     * Filters response handlers by a given class.
     */
    filterResponseHandlersWithTarget(target: Function): ResponseHandlerMetadataArgs[];
    /**
     * Filters response handlers by a given classes.
     */
    filterResponseHandlersWithTargetAndMethod(target: Function, methodName: string): ResponseHandlerMetadataArgs[];
    /**
     * Removes all saved metadata.
     */
    reset(): void;
}
