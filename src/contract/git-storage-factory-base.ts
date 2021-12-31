import { IGitStorage } from './i-git-storage';

/**
 * git存储工厂
 */
export abstract class GitStorageFactoryBase {
    /**
     * 创建git存储对象
     */
    public abstract build(): IGitStorage;
}