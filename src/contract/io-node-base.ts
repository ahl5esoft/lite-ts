import { IFileEntry } from './i-file-entry';

export abstract class IONodeBase {
    public constructor(
        public fileEntry: IFileEntry
    ) { }

    /**
     * 拷贝
     * 
     * @param dstPath 目标路径
     */
    public abstract copyTo(dstPath: string): Promise<void>;

    /**
     * 移动
     * 
     * @param dstPath 目标路径
     */
    public abstract move(dstPath: string): Promise<void>;

    /**
     * 删除
     */
    public abstract remove(): Promise<void>;
}
