import { IGitRepository } from './i-git-repository';
import { IGitRepositoryData } from './i-git-repository-data';

/**
 * git存储接口
 */
export interface IGitStorage {
    /**
     * 清理该存储克隆的所有仓储
     */
    flush(): Promise<void>;

    /**
     * 
     * @param data git仓储凭证数据
     */
    getRepository(data: IGitRepositoryData): Promise<IGitRepository>;
}