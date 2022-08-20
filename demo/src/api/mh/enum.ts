import { Inject, Service } from 'typedi';

import { enum_ } from '../../model';
import { EnumFactoryBase, IApi } from '../../../../src';

/**
 * 枚举
 */
@Service()
export default class EnumApi implements IApi {
    /**
     * 枚举工厂
     */
    @Inject()
    public enumFactory: EnumFactoryBase;

    public async call() {
        const res = await this.enumFactory.build(enum_.CityData).items;
        return Object.values(res).map(r => {
            return r.data;
        });
    }
}