import { extname } from 'path';

import { IONodeBase } from './io-node-base';

export abstract class IOFileBase extends IONodeBase {
    public get ext() {
        return extname(this.fileEntry.path);
    }

    public abstract readJSON<T>(): Promise<T>;

    public abstract readString(): Promise<string>;

    public abstract write(content: any): Promise<void>;
}
