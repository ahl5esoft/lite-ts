import { basename, join } from 'path';

/**
 * 目录或文件基础接口
 */
export abstract class IONodeBase {
    /**
     * 目录或文件路径
     */
    public path: string;

    /**
     * 目录或文件名
     */
    public get name() {
        return basename(this.path);
    }

    /**
     * 构造函数
     * 
     * @param paths 组成路径的数组
     */
    public constructor(paths: string[]) {
        if (paths.length == 1)
            this.path = paths[0];
        else
            this.path = join(...paths);
    }

    /**
     * 拷贝
     * 
     * @param dstPath 目标路径
     */
    public abstract copyTo(dstPath: string): Promise<void>;

    /**
     * 是否存在
     */
    public abstract exists(): Promise<boolean>;

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
