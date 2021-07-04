type NextType = CORBase | (() => CORBase);

export abstract class CORBase {
    private m_Nexts: NextType[] = [];

    public break = false;

    public async handle(): Promise<void> {
        if (this.break)
            return;

        for (const r of this.m_Nexts) {
            let handler = r instanceof CORBase ? r : r();
            await handler.handle();
            if (handler.break)
                break;
        }
    }

    public setNext(next: NextType): this {
        this.m_Nexts.push(next);
        return this;
    }
}