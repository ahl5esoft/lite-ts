import { UnitOfWorkBase } from './unit-of-work-base';
import { IUnitOfWork } from '../..';

/**
 * 多工作单元
 */
export class MultiUnitOfWork extends UnitOfWorkBase {
    /**
     * 构造函数
     * 
     * @param uows 工作单元
     */
    public constructor(
        public uows: { [dbType: string]: IUnitOfWork }
    ) {
        super();
    }

    /**
     * 提交
     */
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