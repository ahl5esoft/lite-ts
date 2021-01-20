import { Action } from "./Action";
import { BaseDriver } from "./driver/BaseDriver";
import { ParamMetadata } from "./metadata/ParamMetadata";
/**
 * Handles action parameter.
 */
export declare class ActionParameterHandler<T extends BaseDriver> {
    private driver;
    constructor(driver: T);
    /**
     * Handles action parameter.
     */
    handle(action: Action, param: ParamMetadata): Promise<any> | any;
    /**
     * Handles non-promise value.
     */
    protected handleValue(value: any, action: Action, param: ParamMetadata): Promise<any> | any;
    /**
     * Normalizes parameter value.
     */
    protected normalizeParamValue(value: any, param: ParamMetadata): Promise<any>;
    /**
     * Normalizes string value to number or boolean.
     */
    protected normalizeStringValue(value: string, parameterName: string, parameterType: string): string | number | boolean | Date;
    /**
     * Parses string value into a JSON object.
     */
    protected parseValue(value: any, paramMetadata: ParamMetadata): any;
    /**
     * Perform class-transformation if enabled.
     */
    protected transformValue(value: any, paramMetadata: ParamMetadata): any;
    /**
     * Perform class-validation if enabled.
     */
    protected validateValue(value: any, paramMetadata: ParamMetadata): Promise<any> | any;
}
