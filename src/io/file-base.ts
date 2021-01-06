import { extname } from 'path';

import { NodeBase } from './node-base';

export abstract class FileBase extends NodeBase {
    public get ext(): string {
        return extname(this.path);
    }

    public abstract readJSON<T>(): Promise<T>;
    public abstract readString(): Promise<string>;
    public abstract write(content: any): Promise<void>;
}
