import { IApi } from './i-api';

export abstract class ApiFactoryBase {
    /**
     * @example
     * ```typescript
     *  const apiFactory: ApiFactory;
     *  const res = apiFactory.build('endpoint', 'api');
     *  // res = IApi实例, src/api/endpoint/api.ts
     * ```
     */
    public abstract build(endpoint: string, apiName: string): IApi;
}