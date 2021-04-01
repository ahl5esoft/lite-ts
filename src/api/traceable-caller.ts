import { APICallerBase } from './caller-base';
import { ITraceable, TraceFactoryBase, traceKey, TraceSpanBase, traceSpanKey } from '../runtime';

export class TraceableAPICaller extends APICallerBase implements ITraceable {
    public traceID: string;

    public traceSpanID: string;

    public constructor(
        private m_APICaller: APICallerBase,
        private m_TraceFactory: TraceFactoryBase
    ) {
        super();
    }

    public async call<T>(route: string, ms?: number): Promise<T> {
        const traceSpan = await this.beginSpan('call', route);
        return await this.m_APICaller.setHeaders(this.headers).setBody(this.body).call<T>(route, ms).finally(() => {
            this.headers = {};
            this.body = {};
            traceSpan.end().catch(console.log);
        });
    }

    public async voidCall(route: string) {
        const traceSpan = await this.beginSpan('voidCall', route);
        return this.m_APICaller.setHeaders(this.headers).setBody(this.body).voidCall(route).finally(() => {
            this.headers = {};
            this.body = {};
            traceSpan.end().catch(console.log);
        });
    }

    private async beginSpan(action: string, route: string): Promise<TraceSpanBase> {
        const trace = this.m_TraceFactory.build(this.traceID);
        this.headers[traceKey] = await trace.getID();
        const traceSpan = trace.createSpan(this.traceSpanID);
        this.headers[traceSpanKey] = traceSpan.getID();
        await traceSpan.begin('api-caller');
        traceSpan.addLabel('action', action);
        traceSpan.addLabel('route', route);
        return traceSpan;
    }
}