import { IUnitOfWork } from '../..';

export abstract class UnitOfWorkBase implements IUnitOfWork {
    private m_AfterActions: (() => Promise<void>)[] = [];

    public async commit() {
        await this.onCommit();

        for (const r of this.m_AfterActions)
            await r();
        this.m_AfterActions = [];
    }

    protected abstract onCommit(): Promise<void>;

    public registerAfter(action: () => Promise<void>) {
        this.m_AfterActions.push(action);
    }
}