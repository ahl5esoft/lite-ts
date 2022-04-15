import { EnumItem } from '../enum';
import { CustomError } from '../error';
import { IReadonlyEnum, IEnumItem, IEnumItemData, RpcBase } from '../../contract';

/**
 * 远程过程调用枚举
 */
export class RpcEnum<T extends IEnumItemData> implements IReadonlyEnum<T> {
    private m_Items: IEnumItem<T>[];
    /**
     * 所有枚举项
     */
    public get items() {
        return new Promise<IEnumItem<T>[]>(async (s, f) => {
            if (!this.m_Items) {
                try {
                    const resp = await this.m_Rpc.setBody({
                        name: this.m_Name
                    }).call<T[]>(this.m_Route);
                    if (resp.err)
                        return new CustomError(resp.err, resp.data);

                    this.m_Items = resp.data.map(r => {
                        return new EnumItem<T>(r, this.m_Name, this.m_Sep);
                    });
                } catch (ex) {
                    return f(ex);
                }
            }

            s(this.m_Items);
        });
    }

    /**
     * 构造函数
     * 
     * @param m_Rpc 远程过程调用
     * @param m_Name 枚举名
     * @param m_Route 路由
     * @param m_Sep 分隔符(default: -)
     */
    public constructor(
        private m_Rpc: RpcBase,
        private m_Name: string,
        private m_Route: string,
        private m_Sep = '-',
    ) { }

    /**
     * 获取满足条件的单个枚举项
     * 
     * @param predicate 断言
     */
    public async get(predicate: (data: T) => boolean) {
        const items = await this.items;
        return items.find(r => {
            return predicate(r.data);
        });
    }
}