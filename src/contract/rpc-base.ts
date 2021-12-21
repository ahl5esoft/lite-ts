import { IApiResponse } from '.';

export abstract class RpcBase {
    public abstract call(route: string): Promise<IApiResponse>;
    public abstract setBody(v: any): RpcBase;
    public abstract setHeader(v: { [key: string]: string }): RpcBase;
}