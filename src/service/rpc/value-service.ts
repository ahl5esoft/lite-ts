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
                const entries = await this.userService.associateService.find<T>(this.targetTypeData.key);
                s(
                    entries.length == 1 ? entries[0] : entries.find(r => r.no == this.m_Entry.no)
                );
            } catch (ex) {
                f(ex);
            }
        });
    }

    public get now() {
        return this.userService.valueService.now;
    }

    public constructor(
        protected rpc: RpcBase,
        protected userService: UserServiceBase,
        protected targetTypeData: enum_.TargetTypeData,
        private m_Entry: T,
        enumFactory: EnumFactoryBase,
    ) {
        super(enumFactory);
    }

    public async update(_: IUnitOfWork, values: contract.IValue[]) {
        await this.rpc.call<void>({
            body: {
                ...this.m_Entry,
                values: values
            },
            route: `/${this.targetTypeData.app}/update-values-by-user-id`
        });
    }
}