import { ClientSession } from 'mongodb';

import { toDoc } from './helper';
import { Pool } from './pool';
import { UnitOfWorkBase } from '../../db';

export class UnitOfWork extends UnitOfWorkBase {
    private m_Queue: ((session: ClientSession) => Promise<void>)[] = [];

    public constructor(private m_Pool: Pool) {
        super();
    }

    public async commit(): Promise<void> {
        const client = await this.m_Pool.getClient();
        const session = client.startSession();
        session.startTransaction();

        for (let r of this.m_Queue)
            await r(session);

        await session.commitTransaction();

        this.m_Queue = [];
    }

    public registerAdd(table: string, entry: any): void {
        this.m_Queue.push(async (session: ClientSession): Promise<void> => {
            const db = await this.m_Pool.getDb();
            await db.collection(table, {
                session: session,
            }).insertOne(toDoc(entry));
        });
    }

    public registerRemove(table: string, entry: any): void {
        this.m_Queue.push(
            async (session: ClientSession): Promise<void> => {
                const db = await this.m_Pool.getDb();
                await db.collection(table, {
                    session: session,
                }).deleteOne({
                    _id: entry.id,
                });
            }
        );
    }

    public registerSave(table: string, entry: any): void {
        this.m_Queue.push(
            async (session: ClientSession): Promise<void> => {
                const db = await this.m_Pool.getDb();
                await db.collection(table, {
                    session: session,
                }).updateOne({
                    _id: entry.id,
                }, {
                    $set: toDoc(entry),
                });
            }
        );
    }
}
