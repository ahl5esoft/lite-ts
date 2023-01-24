import { Inject, Service } from 'typedi';

import { EnumFactoryBase, IUnitOfWork, IValueInterceptor, ValueServiceBase } from '../../contract';
import { contract, enum_, global } from '../../model';

@Service()
export class ValueSyncValueInterceptor implements IValueInterceptor {
    @Inject()
    public enumFactory: EnumFactoryBase;

    public async after(uow: IUnitOfWork, valueService: ValueServiceBase<global.UserValue>, changeValue: contract.IValue) {
        const allItem = await this.enumFactory.build(enum_.ValueTypeData).allItem;
        await valueService.update(
            uow,
            allItem[changeValue.valueType].entry.sync.valueTypes.map(r => {
                return {
                    ...changeValue,
                    valueType: r,
                };
            })
        );
    }

    public async before() {
        return false;
    }
}