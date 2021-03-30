import { BentAPICaller } from './api-caller';
import { APICallerBase } from '../../api';
import { ITraceable, traceKey } from '../../runtime';
import { traceSpanKey } from '../../runtime/trace-base';

export class TraceableBentAPICaller extends APICallerBase implements ITraceable {
    private m_APICaller: BentAPICaller;

    public traceID: string;

    public traceSpanID: string;

    public constructor(baseURL: string) {
        super();

        this.m_APICaller = new BentAPICaller(baseURL);
    }

    public async call<T>(route: string, ms?: number): Promise<T> {
        if (this.traceID)
            this.headers[traceKey] = this.traceID;

        if (this.traceSpanID)
            this.headers[traceSpanKey] = this.traceSpanID;

        const res = await this.m_APICaller.setHeaders(this.headers).setBody(this.body).call<T>(route, ms);
        this.headers = {};
        this.body = {};
        return res;
    }

    public async voidCall(route: string) {
        if (this.traceID)
            this.headers[traceKey] = this.traceID;

        if (this.traceSpanID)
            this.headers[traceSpanKey] = this.traceSpanID;

        return this.m_APICaller.setHeaders(this.headers).setBody(this.body).voidCall(route).finally(() => {
            this.headers = {};
            this.body = {};
        });
    }
}