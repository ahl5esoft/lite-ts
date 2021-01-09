import { basename, join } from 'path';

export abstract class IONodeBase {
    public get name() {
        return basename(this.path);
    }

    private m_Path: string;
    public get path(): string {
        return this.m_Path;
    }

    public constructor(...paths: string[]) {
        this.m_Path = join(...paths);
    }

    public abstract isExist(): Promise<boolean>;
    public abstract move(dstPath: string): Promise<void>;
    public abstract remove(): Promise<void>;
}