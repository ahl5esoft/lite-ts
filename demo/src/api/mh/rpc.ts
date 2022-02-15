import { Inject, Service } from 'typedi';

import { IApi, model, RpcBase, service } from '../../../../src';

/**
 * 远程调用
 */
@Service()
export default class RpcApi implements IApi {
    /**
     * 远程对象
     */
    @Inject()
    public rpc: RpcBase;

    public async call() {
        const resp = await this.rpc.setHeader({
            [model.enum_.Header.authData]: decodeURIComponent(
                JSON.stringify({
                    from: 'test',
                    id: 'uid'
                })
            )
        }).call('/mh/find-items');
        if (resp.err)
            throw new service.CustomError(resp.err, resp.data);

        return resp.data;
    }
}