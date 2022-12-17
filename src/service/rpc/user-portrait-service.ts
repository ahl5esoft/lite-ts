import { IUserPortraitService, RpcBase } from '../../contract';

export class RpcUserPortraitService implements IUserPortraitService {
    private m_Cache: {
        [userID: string]: {
            [field: string]: any
        }
    } = {};

    public constructor(
        protected rpc: RpcBase,
        protected userID: string,
    ) { }

    public async find<T>(field: string, userID?: string) {
        userID ??= this.userID;
        this.m_Cache[userID] ??= {};

        if (!this.m_Cache[userID][field]) {
            const resp = await this.rpc.callWithoutThrow<T[]>({
                body: { field, userID },
                route: '/portrait/get'
            });
            if (!resp.err)
                this.m_Cache[userID][field] = resp.data;
        }

        return this.m_Cache[userID][field];
    }

    /**
     * 删除
     * 
     * @param field 字段
     * @param userID 用户ID
     */
    public async remove(field: string, userID?: string) {
        userID ??= this.userID;
        this.m_Cache[userID] ??= {};

        await this.rpc.callWithoutThrow<void>({
            body: { field, userID },
            route: '/portrait/remove'
        });
        delete this.m_Cache[userID][field];
    }
}