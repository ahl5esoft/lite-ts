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
    public abstract mv(dstPath: string): Promise<void>;
    public abstract rm(): Promise<void>;
}
