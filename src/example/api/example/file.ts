import { APIBase, FileOption } from '../../../api';

export default class FileAPI extends APIBase {
    public get $fileOption(): FileOption {
        return {
            name: 'f'
        };
    }

    public async call(): Promise<string> {
        return this.$nameOfFiles.f[0].path;
    }
}