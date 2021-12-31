import { IODirectoryBase } from './io-directory-base';
import { IOFileBase } from './io-file-base';
import { IONodeBase } from './io-node-base';

/**
 * io工厂
 */
export abstract class IOFactoryBase {
    /**
     * 创建目录或文件
     * 
     * @param paths 组成路径的数组
     */
    public abstract build(...paths: string[]): Promise<IONodeBase>;

    /**
     * 创建目录
     * 
     * @param paths 组成路径的数组
     */
    public abstract buildDirectory(...paths: string[]): IODirectoryBase;

    /**
     * 创建文件
     * 
     * @param paths 组成路径的数组
     */
    public abstract buildFile(...paths: string[]): IOFileBase;
}
