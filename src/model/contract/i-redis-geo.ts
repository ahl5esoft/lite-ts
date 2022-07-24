/**
 * Redis Geo结构
 */
export interface IRedisGeo {
    /**
     * 纬度
     */
    latitude: number;

    /**
     * 经度
     */
    longitude: number;

    /**
     * 成员
     */
    member: string;
}