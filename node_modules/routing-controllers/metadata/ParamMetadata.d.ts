import { ValidatorOptions } from "class-validator";
import { ActionMetadata } from "./ActionMetadata";
import { ParamMetadataArgs } from "./args/ParamMetadataArgs";
import { ParamType } from "./types/ParamType";
import { ClassTransformOptions } from "class-transformer";
import { Action } from "../Action";
/**
 * Action Parameter metadata.
 */
export declare class ParamMetadata {
    /**
     * Parameter's action.
     */
    actionMetadata: ActionMetadata;
    /**
     * Object on which's method's parameter this parameter is attached.
     */
    object: any;
    /**
     * Method on which's parameter is attached.
     */
    method: string;
    /**
     * Index (# number) of the parameter in the method signature.
     */
    index: number;
    /**
     * Parameter type.
     */
    type: ParamType;
    /**
     * Parameter name.
     */
    name: string;
    /**
     * Parameter target type.
     */
    targetType?: any;
    /**
     * Parameter target type's name in lowercase.
     */
    targetName: string;
    /**
     * Indicates if target type is an object.
     */
    isTargetObject: boolean;
    /**
     * Parameter target.
     */
    target: any;
    /**
     * Specifies if parameter should be parsed as json or not.
     */
    parse: boolean;
    /**
     * Indicates if this parameter is required or not
     */
    required: boolean;
    /**
     * Transforms the value.
     */
    transform: (action: Action, value?: any) => Promise<any> | any;
    /**
     * Additional parameter options.
     * For example it can be uploader middleware options or body-parser middleware options.
     */
    extraOptions: any;
    /**
     * Class transform options used to perform plainToClass operation.
     */
    classTransform?: ClassTransformOptions;
    /**
     * If true, class-validator will be used to validate param object.
     * If validation options are given then it means validation will be applied (is true).
     */
    validate?: boolean | ValidatorOptions;
    constructor(actionMetadata: ActionMetadata, args: ParamMetadataArgs);
}
