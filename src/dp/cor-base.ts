type NextType = CORBase | (() => CORBase);

export abstract class CORBase {
    private m_Nexts: NextType[] = [];

    protected break = false;

    public async handle(): Promise<void> {
        for (const r of this.m_Nexts) {
            let handler = r instanceof CORBase ? r : r();
            if (handler.break)
                break;

            await handler.handle();
        }
    }

    public setNext(next: NextType): this {
        this.m_Nexts.push(next);
        return this;
    }
}