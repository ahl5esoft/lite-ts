import {
    EnumFactoryBase,
    IUnitOfWork,
    MathBase,
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
        private m_UpdateRpcBody: any,
        enumFactory: EnumFactoryBase,
        math: MathBase,
        userService: UserServiceBase,
        getEntryFunc: () => Promise<T>,
    ) {
        super(userService, enumFactory, math, getEntryFunc);
    }

    public async update(uow: IUnitOfWork, values: contract.IValue[]) {
        if (!values.length)
            return;

        const route = ['', this.targetTypeData.app, RpcValueService.updateRoute].join('/');
        if (uow) {
            this.updateValues ??= [];
            this.updateValues.push(...values);
            uow.registerAfter(async () => {
                await this.rpc.call<void>({
                    body: {
                        ...this.m_UpdateRpcBody,
                        values: this.updateValues
                    },
                    route
                });
            }, route);
        } else {
            await this.rpc.call<void>({
                body: {
                    ...this.m_UpdateRpcBody,
                    values
                },
                route
            });
        }
    }
}