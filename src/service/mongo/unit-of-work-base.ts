import { AnyBulkWriteOperation, BulkWriteOptions, ClientSession } from 'mongodb';

import { MongoPool } from './pool';
import { toDoc } from './helper';
import { UnitOfWorkRepositoryBase } from '../../contract';

export abstract class MongoUnitOfWorkBase extends UnitOfWorkRepositoryBase {
    private m_Bulk: { [model: string]: AnyBulkWriteOperation[] } = {};

    public constructor(
        protected blukWriteOptions: BulkWriteOptions,
        protected pool: MongoPool,
    ) {
        super();
    }

    public registerAdd(model: Function, entry: any) {
        this.m_Bulk[model.name] ??= [];
        this.m_Bulk[model.name].push({
            insertOne: {
                document: toDoc(entry)
            }
        });
    }

    public registerRemove(model: Function, entry: any) {
        this.m_Bulk[model.name] ??= [];
        this.m_Bulk[model.name].push({
            deleteOne: {
                filter: {
                    _id: entry.id,
                }
            }
        });
    }

    public registerSave(model: Function, entry: any) {
        this.m_Bulk[model.name] ??= [];

        const doc = toDoc(entry);
        const index = this.m_Bulk[model.name].findIndex(r => {
            return (r as any).updateOne?.filter?._id == doc._id;
        });
        if (index != -1)
            this.m_Bulk[model.name].splice(index, 1);

        delete doc._id;
        this.m_Bulk[model.name].push({
            updateOne: {
                filter: {
                    _id: entry.id,
                },
                update: {
                    $set: doc,
                }
            }
        });
    }

    protected async onCommit() {
        const bulks = Object.entries(this.m_Bulk);
        if (!bulks.length)
            return;

        this.m_Bulk = {};

        const client = await this.pool.client;
        const session = client.startSession({
            defaultTransactionOptions: {
                writeConcern: {
                    w: 1
                }
            }
        });
        await this.commitWithSession(session, bulks);
        await session.endSession();
    }

    protected abstract commitWithSession(session: ClientSession, bulks: [string, AnyBulkWriteOperation[]][]): Promise<void>;
}
