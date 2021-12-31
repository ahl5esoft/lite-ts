import { IOFileBase } from './io-file-base';
import { IONodeBase } from './io-node-base';

/**
 * 目录接口
 */
export abstract class IODirectoryBase extends IONodeBase {
    /**
     * 创建
     */
    public abstract create(): Promise<void>;

    /**
     * 获取所有子目录
     */
    public abstract findDirectories(): Promise<IODirectoryBase[]>;

    /**
     * 获取所有子文件
     */
    public abstract findFiles(): Promise<IOFileBase[]>;
}
