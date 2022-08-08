/**
 * 用户画像服务
 */
 export interface IUserPortraitService {
    /**
     * 查询
     * 
     * @param field 字段
     * @param userID 用户ID
     */
    find<T>(field: string, userID?: string): Promise<T[]>;
    /**
     * 删除
     * 
     * @param field 字段
     * @param userID 用户ID
     */
    remove(field: string, userID?: string): Promise<void>;
}