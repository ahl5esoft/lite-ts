import { Action } from "./Action";
/**
 * Special function used to get currently authorized user.
 */
export declare type CurrentUserChecker = (action: Action) => Promise<any> | any;
