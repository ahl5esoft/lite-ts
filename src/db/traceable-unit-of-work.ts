import { UnitOfWorkBase } from './unit-of-work-base';
import { Trace } from '../runtime';

class Item {
    public action: string;

    public entry: any;

    public table: string;
}

export class TraceableUnitOfWork extends UnitOfWorkBase {
    private m_Items: Item[] = [];

    public constructor(
        private m_Trace: Trace,
        private m_TraceSpanID: string,
        private m_Uow: UnitOfWorkBase,
    ) {
        super();
    }

    public async commit() {
        const traceSpan = await this.m_Trace.beginSpan('uow', this.m_TraceSpanID);
        traceSpan.addLabel('items', this.m_Items);
        await this.m_Uow.commit().finally(() => {
            traceSpan.end().catch(console.log);
            this.m_Items = [];
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
        this.m_Items.push({
            action: action,
            entry: JSON.parse(
                JSON.stringify(entry)
            ),
            table: table
        });
    }
}