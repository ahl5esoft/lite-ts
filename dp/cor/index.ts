export abstract class CORHandlerBase {
    private m_Handlers: CORHandlerBase[] = [this];

    public async handle(ctx: any): Promise<void> {
        for (const r of this.m_Handlers) {
            await r.handling(ctx);
        }
    }

    public setNext(handler: CORHandlerBase): this {
        this.m_Handlers.push(handler);
        return this;
    }

    protected abstract handling(ctx: any): Promise<void>;
}
