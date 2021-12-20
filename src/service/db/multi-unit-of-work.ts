import { UnitOfWorkBase } from './unit-of-work-base';
import { IUnitOfWork } from '../..';

export class MultiUnitOfWork extends UnitOfWorkBase {
    public constructor(
        public uows: { [dbType: string]: IUnitOfWork }
    ) {
        super();
    }

    protected async onCommit() {
        let err: Error;
        for (const r of Object.values(this.uows)) {
            try {
                await r.commit();
            } catch (ex) {
                err = ex;
            }
        }
        if (err)
            throw err;
    }
}