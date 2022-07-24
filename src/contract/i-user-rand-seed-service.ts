import { IUnitOfWork } from './i-unit-of-work';

/**
 * 用户随机种子服务
 */
export interface IUserRandSeedService {
    /**
     * 获取
     * 
     * @param uow 工作单元
     * @param len 长度 
     * @param offset 偏移
     */
    get(uow: IUnitOfWork, len: number, offset: number): Promise<number>;
    /**
     * 使用
     * 
     * @param uow 工作单元
     * @param len 长度 
     */
    use(uow: IUnitOfWork, len: number): Promise<number>;
}