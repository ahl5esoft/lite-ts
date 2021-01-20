import { UploadOptions } from "../decorator-options/UploadOptions";
/**
 * Injects an uploaded file object to the controller action parameter.
 * Must be applied on a controller action parameter.
 */
export declare function UploadedFile(name: string, options?: UploadOptions): Function;
