import { Action } from "./Action";
/**
 * Container options.
 */
export interface UseContainerOptions {
    /**
     * If set to true, then default container will be used in the case if given container haven't returned anything.
     */
    fallback?: boolean;
    /**
     * If set to true, then default container will be used in the case if given container thrown an exception.
     */
    fallbackOnErrors?: boolean;
}
export declare type ClassConstructor<T> = {
    new (...args: any[]): T;
};
/**
 * Allows routing controllers to resolve objects using your IoC container
 */
export interface IocAdapter {
    /**
     * Return
     */
    get<T>(someClass: ClassConstructor<T>, action?: Action): T;
}
/**
 * Sets container to be used by this library.
 */
export declare function useContainer(iocAdapter: IocAdapter, options?: UseContainerOptions): void;
/**
 * Gets the IOC container used by this library.
 * @param someClass A class constructor to resolve
 * @param action The request/response context that `someClass` is being resolved for
 */
export declare function getFromContainer<T>(someClass: ClassConstructor<T> | Function, action?: Action): T;
