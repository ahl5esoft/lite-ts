import { global } from '../model';

/**
 * 用户订单服务
 */
export interface IUserOrderService<T extends global.UserOrder> {
    /**
     * 完成订单
     * 
     * @param orderID 订单编号
     */
    complete(orderID: string): Promise<void>;
    /**
     * 获取订单
     * 
     * @param orderID 订单编号
     */
    get(orderID: string): Promise<T>;
}