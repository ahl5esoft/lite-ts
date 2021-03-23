import bent, { RequestFunction, ValidResponse } from 'bent';

import { APICallerBase } from '../../api';
import { CustomError, ErrorCode } from '../../error';

export class BentAPICaller extends APICallerBase {
    public static expires = 3000;

    private m_PostFunc: RequestFunction<ValidResponse> = null;

    public constructor(baseURL: string) {
        super();

        this.m_PostFunc = bent(baseURL, 'POST', 'json', 200);
    }

    public async call<T>(route: string, body: any, ms?: number): Promise<T> {
        return Promise.race([
            new Promise<T>((_, f) => {
                setTimeout(() => {
                    f(
                        new CustomError(ErrorCode.Timeout)
                    );
                }, ms || BentAPICaller.expires);
            }),
            new Promise<T>(async (s, f) => {
                const resp = await this.m_PostFunc(route, body);
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
        ]);
    }

    public async voidCall(route: string, body: any) {
        this.m_PostFunc(route, body).catch(console.log);
    }
}