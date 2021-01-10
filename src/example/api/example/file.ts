import { APIBase } from '../../../api';
import { FileUploadOption } from '../../../plugin/express';

export default class FileAPI extends APIBase {
    public get $fileOption(): FileUploadOption {
        return {
            name: 'f'
        };
    }

    public async call(): Promise<string> {
        return this.$nameOfFiles.f[0].path;
    }
}