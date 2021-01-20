/**
 * Runs given callback that returns promise for each item in the given collection in order.
 * Operations executed after each other, right after previous promise being resolved.
 */
export declare function runInSequence<T, U>(collection: T[], callback: (item: T) => Promise<U>): Promise<U[]>;
