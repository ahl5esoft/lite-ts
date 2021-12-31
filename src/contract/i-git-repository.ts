import { IODirectoryBase } from './io-directory-base';

/**
 * git仓储接口
 */
export interface IGitRepository {
    /**
     * git目录
     */
    readonly dir: IODirectoryBase;

    /**
     * 增加提交文件
     * 
     * @param files 文件列表
     */
    add(files: string | string[]): Promise<void>;

    /**
     * 切换分支
     * 
     * @param branch 分支
     */
    checkoutBranch(branch: string): Promise<void>;

    /**
     * 克隆
     * 
     * @param branch 分支
     */
    clone(branch: string): Promise<void>;

    /**
     * 提交
     * 
     * @param message 消息
     */
    commit(message: string): Promise<void>;

    /**
     * 初始化仓储
     */
    initRemote(): Promise<void>;

    /**
     * 拉取
     * 
     * @param branch 分支
     */
    pull(branch: string): Promise<void>;

    /**
     * 推送
     * 
     * @param remote 默认origin
     * @param branch 分支
     */
    push(remote: string, branch: string): Promise<void>;
}