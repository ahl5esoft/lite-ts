import moment from 'moment';

import { EnumFactoryBase } from './enum-factory-base';
import { IUnitOfWork } from './i-unit-of-work';
import { NowTimeBase } from './now-time-base';
import { UserServiceBase } from './user-service-base';
import { ValueServiceBase } from './value-service-base';
import { contract, global } from '../model';

export abstract class UserValueServiceBase extends ValueServiceBase<global.UserValue> {
    public get entry() {
        return new Promise<global.UserValue>(async (s, f) => {
            try {
                const entries = await this.userService.associateService.find<global.UserValue>(global.UserValue.name, r => {
                    return r.id == this.userService.userID;
                });
                s(entries[0]);
            } catch (ex) {
                f(ex);
            }
        });
    }

    private m_Now: [number, number];
    public get now() {
        return new Promise<number>(async (s, f) => {
            const nowUnix = moment().unix();
            if (!this.m_Now) {
                try {
                    const entry = await this.entry;
                    const temp: [number, number] = [
                        entry?.values?.[this.nowValueType] ?? 0,
                        nowUnix
                    ];
                    if (!temp[0])
                        temp[0] = await this.nowTime.unix();

                    this.m_Now = temp;
                } catch (ex) {
                    return f(ex);
                }
            }

            s(this.m_Now[0] + nowUnix - this.m_Now[1]);
        });
    }

    public constructor(
        public userService: UserServiceBase,
        protected nowTime: NowTimeBase,
        protected nowValueType: number,
        enumFactory: EnumFactoryBase,
    ) {
        super(enumFactory);
    }

    public abstract update(uow: IUnitOfWork, values: contract.IValue[]): Promise<void>;
}