import { IUserOrderService, RpcBase } from '../../contract';
import { global } from '../../model';

/**
 * 用户订单服务
 */
export class RpcUserOrderService<T extends global.UserOrder> implements IUserOrderService<T> {
    /**
     * 完成路由
     */
    public static completeRoute = '/order/ih/complete-by-user';
    /**
     * 获取路由
     */
    public static getRoute = '/order/ih/get-by-user';

    /**
     * 构造函数
     * 
     * @param m_Rpc 远程过程调用
     * @param m_UserID 用户ID
     */
    public constructor(
        private m_Rpc: RpcBase,
        private m_UserID: string,
    ) { }

    /**
     * 完成订单
     * 
     * @param orderID 订单编号
     */
    public async complete(orderID: string) {
        await this.m_Rpc.setBody({
            id: orderID,
            userID: this.m_UserID
        }).call<void>(RpcUserOrderService.completeRoute);
    }

    /**
     * 获取订单
     * 
     * @param orderID 订单编号
     */
    public async get(orderID: string) {
        const resp = await this.m_Rpc.setBody({
            id: orderID,
            userID: this.m_UserID,
        }).call<T>(RpcUserOrderService.getRoute);
        return resp.data;
    }
}