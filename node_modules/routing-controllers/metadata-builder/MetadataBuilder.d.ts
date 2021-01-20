import { ActionMetadata } from "../metadata/ActionMetadata";
import { ControllerMetadata } from "../metadata/ControllerMetadata";
import { InterceptorMetadata } from "../metadata/InterceptorMetadata";
import { MiddlewareMetadata } from "../metadata/MiddlewareMetadata";
import { ParamMetadata } from "../metadata/ParamMetadata";
import { ResponseHandlerMetadata } from "../metadata/ResponseHandleMetadata";
import { RoutingControllersOptions } from "../RoutingControllersOptions";
import { UseMetadata } from "../metadata/UseMetadata";
/**
 * Builds metadata from the given metadata arguments.
 */
export declare class MetadataBuilder {
    private options;
    constructor(options: RoutingControllersOptions);
    /**
     * Builds controller metadata from a registered controller metadata args.
     */
    buildControllerMetadata(classes?: Function[]): ControllerMetadata[];
    /**
     * Builds middleware metadata from a registered middleware metadata args.
     */
    buildMiddlewareMetadata(classes?: Function[]): MiddlewareMetadata[];
    /**
     * Builds interceptor metadata from a registered interceptor metadata args.
     */
    buildInterceptorMetadata(classes?: Function[]): InterceptorMetadata[];
    /**
     * Creates middleware metadatas.
     */
    protected createMiddlewares(classes?: Function[]): MiddlewareMetadata[];
    /**
     * Creates interceptor metadatas.
     */
    protected createInterceptors(classes?: Function[]): InterceptorMetadata[];
    /**
     * Creates controller metadatas.
     */
    protected createControllers(classes?: Function[]): ControllerMetadata[];
    /**
     * Creates action metadatas.
     */
    protected createActions(controller: ControllerMetadata): ActionMetadata[];
    /**
     * Creates param metadatas.
     */
    protected createParams(action: ActionMetadata): ParamMetadata[];
    /**
     * Decorate paramArgs with default settings
     */
    private decorateDefaultParamOptions;
    /**
     * Creates response handler metadatas for action.
     */
    protected createActionResponseHandlers(action: ActionMetadata): ResponseHandlerMetadata[];
    /**
     * Creates response handler metadatas for controller.
     */
    protected createControllerResponseHandlers(controller: ControllerMetadata): ResponseHandlerMetadata[];
    /**
     * Creates use metadatas for actions.
     */
    protected createActionUses(action: ActionMetadata): UseMetadata[];
    /**
     * Creates use interceptors for actions.
     */
    protected createActionInterceptorUses(action: ActionMetadata): InterceptorMetadata[];
    /**
     * Creates use metadatas for controllers.
     */
    protected createControllerUses(controller: ControllerMetadata): UseMetadata[];
    /**
     * Creates use interceptors for controllers.
     */
    protected createControllerInterceptorUses(controller: ControllerMetadata): InterceptorMetadata[];
}
