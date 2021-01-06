/**
 * Marks given class as a middleware.
 * Allows to create global middlewares and control order of middleware execution.
 */
export declare function Middleware(options: {
    type: "after" | "before";
    priority?: number;
}): Function;
