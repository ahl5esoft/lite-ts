import { Field } from 'multer';

export class FileUploadOption {
    /** Maximum size of each form field name in bytes. (Default: 100) */
    public fieldNameSize?: number;

    /** Maximum size of each form field value in bytes. (Default: 1048576) */
    public fieldSize?: number;

    /** Maximum number of non-file form fields. (Default: Infinity) */
    public fields?: number;

    /** Maximum size of each file in bytes. (Default: Infinity) */
    public fileSize?: number;

    /** Maximum number of file fields. (Default: Infinity) */
    public files?: number;

    /** Maximum number of parts (non-file fields + files). (Default: Infinity) */
    public parts?: number;

    /** Maximum number of headers. (Default: 2000) */
    public headerPairs?: number;
}

export class FileOption {
    public fields?: Field[];

    public limit?: FileUploadOption;

    public name?: string;
}