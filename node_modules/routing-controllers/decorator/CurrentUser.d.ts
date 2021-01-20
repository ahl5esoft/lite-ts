/**
 * Injects currently authorized user.
 * Authorization logic must be defined in routing-controllers settings.
 */
export declare function CurrentUser(options?: {
    required?: boolean;
}): (object: Object, methodName: string, index: number) => void;
