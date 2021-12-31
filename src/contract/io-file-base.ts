import { extname } from 'path';

import { IONodeBase } from './io-node-base';

/**
 * 文件接口
 */
export abstract class IOFileBase extends IONodeBase {
    /**
     * 扩展名
     */
    public get ext(): string {
        return extname(this.path);
    }

    /**
     * 读取json
     */
    public abstract readJSON<T>(): Promise<T>;

    /**
     * 读取文本
     */
    public abstract readString(): Promise<string>;

    /**
     * 写入
     * 
     * @param content 内容
     */
    public abstract write(content: any): Promise<void>;
}
