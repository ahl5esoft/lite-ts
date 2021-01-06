export abstract class HandlerBase<T> {
    private m_Handlers: HandlerBase<T>[] = [this];

    public async handle(ctx: T): Promise<void> {
        for (const r of this.m_Handlers) {
            await r.handling(ctx);
        }
    }

    public setNext(handler: HandlerBase<T>): this {
        this.m_Handlers.push(handler);
        return this;
    }

    protected abstract handling(ctx: T): Promise<void>;
}
