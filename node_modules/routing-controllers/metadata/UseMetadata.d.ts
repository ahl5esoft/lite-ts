import { UseMetadataArgs } from "./args/UseMetadataArgs";
/**
 * "Use middleware" metadata.
 */
export declare class UseMetadata {
    /**
     * Object class of the middleware class.
     */
    target: Function;
    /**
     * Method used by this "use".
     */
    method: string;
    /**
     * Middleware to be executed by this "use".
     */
    middleware: Function;
    /**
     * Indicates if middleware must be executed after routing action is executed.
     */
    afterAction: boolean;
    constructor(args: UseMetadataArgs);
}
