export abstract class LoadBalanceBase {
    public abstract getUrl(app: string, env: string): Promise<string>;
}