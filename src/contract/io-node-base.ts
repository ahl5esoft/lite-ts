import { basename, join } from 'path';

export abstract class IONodeBase {
    public path: string;

    public get name() {
        return basename(this.path);
    }

    public constructor(paths: string[]) {
        if (paths.length == 1)
            this.path = paths[0];
        else
            this.path = join(...paths);
    }

    public abstract copyTo(dstPath: string): Promise<void>;
    public abstract exists(): Promise<boolean>;
    public abstract move(dstPath: string): Promise<void>;
    public abstract remove(): Promise<void>;
}
