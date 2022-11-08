import {
    EnumFactoryBase,
    IUnitOfWork,
    RpcBase,
    UserServiceBase,
    ValueServiceBase
} from '../../contract';
import { contract, enum_, global } from '../../model';

export class RpcValueService<T extends global.UserTargetValue> extends ValueServiceBase<T>{
    public get entry() {
        return new Promise<T>(async (s, f) => {
            try {
                const entries = await this.m_UserService.associateService.find<T>(this.m_TargetTypeData.key);
                s(
                    entries.length == 1 ? entries[0] : entries.find(r => r.no == this.m_Entry.no)
                );
            } catch (ex) {
                f(ex);
            }
        });
    }

    public get now() {
        return this.m_UserService.valueService.now;
    }

    public constructor(
        private m_Rpc: RpcBase,
        private m_UserService: UserServiceBase,
        private m_TargetTypeData: enum_.TargetTypeData,
        private m_Entry: T,
        enumFactory: EnumFactoryBase,
    ) {
        super(enumFactory);
    }

    public async update(_: IUnitOfWork, values: contract.IValue[]) {
        await this.m_Rpc.call<void>({
            body: {
                ...this.m_Entry,
                values: values
            },
            route: `/${this.m_TargetTypeData.app}/update-values-by-user-id`
        });
    }
}