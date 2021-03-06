import { extname } from 'path';

import { IONodeBase } from './node-base';

export abstract class FileBase extends IONodeBase {
    public get ext(): string {
        return extname(this.path);
    }

    public abstract readJSON<T>(): Promise<T>;
    public abstract readString(): Promise<string>;
    public abstract write(content: any): Promise<void>;
}
