import bent, { RequestFunction, ValidResponse } from 'bent';

import { APICallerBase } from '../../api';
import { CustomError, ErrorCode } from '../../error';

export class BentAPICaller extends APICallerBase {
    public static expires = 3000;

    private m_PostFunc: RequestFunction<ValidResponse> = null;

    public constructor(baseURL: string) {
        super();

        if (!baseURL.endsWith('/'))
            baseURL += '/';
        this.m_PostFunc = bent(baseURL, 'POST', 'json', 200);
    }

    public async call<T>(route: string, ms?: number): Promise<T> {
        return Promise.race([
            new Promise<T>((_, f) => {
                setTimeout(() => {
                    f(
                        new CustomError(ErrorCode.Timeout)
                    );
                }, ms || BentAPICaller.expires);
            }),
            new Promise<T>(async (s, f) => {
                const resp = await this.m_PostFunc(route, this.body, this.headers);
                const res = resp as {
                    err: number;
                    data: any;
                };
                if (res.err) {
                    f(
                        new CustomError(res.err, res.data)
                    );
                } else {
                    s(res.data);
                }
            })
        ]).finally(() => {
            this.body = {};
            this.headers = {};
        });
    }

    public async voidCall(route: string) {
        this.m_PostFunc(route, this.body, this.headers).catch(console.log).finally(() => {
            this.body = {};
            this.headers = {};
        });
    }
}