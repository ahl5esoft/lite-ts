import {
    EnumFactoryBase,
    IUnitOfWork,
    RpcBase,
    UserServiceBase,
    ValueServiceBase
} from '../../contract';
import { contract, enum_, global } from '../../model';

export class RpcValueService<T extends global.UserValue> extends ValueServiceBase<T>{
    public static updateRoute = 'update-values-by-user-id';

    public constructor(
        protected rpc: RpcBase,
        protected targetTypeData: enum_.TargetTypeData,
        private m_RpcBody: any,
        enumFactory: EnumFactoryBase,
        userService: UserServiceBase,
        getEntryPredicate: (r: T) => boolean,
    ) {
        super(userService, enumFactory, getEntryPredicate);
    }

    public async update(uow: IUnitOfWork, values: contract.IValue[]) {
        const route = ['', this.targetTypeData.app, RpcValueService.updateRoute].join('/')
        if (uow) {
            this.updateValues ??= [];
            this.updateValues.push(...values);
            uow.registerAfter(async () => {
                await this.rpc.call<void>({
                    body: {
                        ...this.m_RpcBody,
                        values: this.updateValues
                    },
                    route
                });
            }, route);
        } else {
            await this.rpc.call<void>({
                body: {
                    ...this.m_RpcBody,
                    values
                },
                route
            });
        }
    }
}