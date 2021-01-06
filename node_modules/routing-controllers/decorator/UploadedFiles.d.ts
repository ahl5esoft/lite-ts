import { UploadOptions } from "../decorator-options/UploadOptions";
/**
 * Injects all uploaded files to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export declare function UploadedFiles(name: string, options?: UploadOptions): Function;
