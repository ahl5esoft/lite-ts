import bent from 'bent';

import { IApiResponse, RpcBase } from '../..';

class Wrapper extends RpcBase {
    private m_Body: any;
    private m_Header: { [key: string]: string; };

    public constructor(
        private m_PostFunc: bent.RequestFunction<bent.Json>
    ) {
        super();
    }

    public async call(route: string) {
        const res = await this.m_PostFunc(route, this.m_Body, this.m_Header);
        return res as IApiResponse;
    }

    public setBody(v: any) {
        this.m_Body = v;
        return this;
    }

    public setHeader(v: { [key: string]: string; }) {
        this.m_Header = v;
        return this;
    }
}

export class BentRpc extends RpcBase {
    private m_PostFunc: bent.RequestFunction<bent.Json>;

    public constructor(
        url: string
    ) {
        super();

        this.m_PostFunc = bent(url, 'json', 'POST', 200);
    }

    public call(route: string) {
        return new Wrapper(this.m_PostFunc).call(route);
    }

    public setBody(v: any) {
        const wrapper = new Wrapper(this.m_PostFunc);
        wrapper.setBody(v);
        return wrapper;
    }

    public setHeader(v: { [key: string]: string; }) {
        const wrapper = new Wrapper(this.m_PostFunc);
        wrapper.setHeader(v);
        return wrapper;
    }
}