import { EnumDataSourceBase } from '../enum';
import { RpcBase } from '../../contract';
import { global } from '../../model';

/**
 * 枚举数据源(rpc)
 */
export class RpcEnumDataSource extends EnumDataSourceBase {
    /**
     * 构造函数
     * 
     * @param m_Rpc 远程过程调用
     * @param m_App 应用
     * @param sep 分隔符
     */
    public constructor(
        private m_Rpc: RpcBase,
        private m_App: string,
        sep: string,
    ) {
        super(sep);
    }

    protected async load() {
        const resp = await this.m_Rpc.call<global.Enum[]>(`/${this.m_App}/find-all-enums`);
        return resp.data;
    }
}