import { IApi } from './i-api';

/**
 * api工厂
 */
export abstract class ApiFactoryBase {
    /**
     * 创建api实例
     * 
     * @param endpoint 端
     * @param apiName api名
     * 
     * @example
     * ```typescript
     *  const apiFactory: ApiFactory;
     *  const res = apiFactory.build('endpoint', 'api');
     *  // res = IApi实例, src/api/endpoint/api.ts
     * ```
     */
    public abstract build(endpoint: string, apiName: string): IApi;
}