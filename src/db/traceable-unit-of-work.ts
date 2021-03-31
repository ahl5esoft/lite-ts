import { TraceBase } from '../runtime';
import { UnitOfWorkBase } from './unit-of-work-base';

class Action {
    public action: string;

    public entry: any;

    public table: string;
}

export class TraceableUnitOfWork extends UnitOfWorkBase {
    private m_Actions: Action[] = [];

    public constructor(
        private m_Trace: TraceBase,
        private m_TraceSpanID: string,
        private m_Uow: UnitOfWorkBase,
    ) {
        super();
    }

    public async commit() {
        const traceSpan = this.m_Trace.createSpan(this.m_TraceSpanID);
        await traceSpan.begin('uow');
        traceSpan.addLabel('actions', this.m_Actions);
        await this.m_Uow.commit().finally(() => {
            traceSpan.end().catch(console.log);
            this.m_Actions = [];
        });
    }

    public registerAdd(table: string, entry: any) {
        this.addAction('add', entry, table);
        this.m_Uow.registerAdd(table, entry);
    }

    public registerRemove(table: string, entry: any) {
        this.addAction('remove', entry, table);
        this.m_Uow.registerRemove(table, entry);
    }

    public registerSave(table: string, entry: any) {
        this.addAction('save', entry, table);
        this.m_Uow.registerSave(table, entry);
    }

    private addAction(action: string, entry: any, table: string) {
        this.m_Actions.push({
            action: action,
            entry: JSON.parse(
                JSON.stringify(entry)
            ),
            table: table
        });
    }
}