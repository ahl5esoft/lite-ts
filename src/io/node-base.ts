import { basename, join } from 'path';

export abstract class IONodeBase {
    public path: string;

    public get name() {
        return basename(this.path);
    }

    public constructor(...paths: string[]) {
        this.path = join(...paths);
    }

    public abstract exists(): Promise<boolean>;
    public abstract move(dstPath: string): Promise<void>;
    public abstract remove(): Promise<void>;
}
