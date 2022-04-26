import { RpcUserOrderService as Self } from './user-order-service';
import { Mock } from '../assert';
import { RpcBase } from '../../contract';

describe('src/service/rpc/user-order-service.ts', () => {
    describe('.complete(orderID: string)', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const userID = 'user-id';
            const self = new Self(mockRpc.actual, userID);

            const orderID = 'order-id';
            mockRpc.expectReturn(
                r => r.setBody({
                    id: orderID,
                    userID: userID
                }),
                mockRpc.actual
            );

            mockRpc.expectReturn(
                r => r.call(Self.completeRoute),
                {}
            );

            await self.complete(orderID);
        });
    });

    describe('.get(orderID: string)', () => {
        it('ok', async () => {
            const mockRpc = new Mock<RpcBase>();
            const userID = 'user-id';
            const self = new Self(mockRpc.actual, userID);

            const orderID = 'order-id';
            mockRpc.expectReturn(
                r => r.setBody({
                    id: orderID,
                    userID: userID
                }),
                mockRpc.actual
            );

            mockRpc.expectReturn(
                r => r.call(Self.getRoute),
                {}
            );

            await self.get(orderID);
        });
    });
});