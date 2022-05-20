import Container from 'typedi';

import { CustomError } from '../error';
import { IApi, IODirectoryBase } from '../..';
import { enum_ } from '../../model';

const invalidAPIError = new CustomError(enum_.ErrorCode.api);
const invalidAPI: IApi = {
    call: async () => {
        throw invalidAPIError;
    }
};

/**
 * api工厂
 */
export class APIFactory {
    /**
     * 构造函数
     * 
     * @param m_APICtors api构造函数
     */
    private constructor(
        private m_APICtors: { [key: string]: { [key: string]: Function; }; }
    ) { }

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
    public build(endpoint: string, apiName: string) {
        const apiCtors = this.m_APICtors[endpoint];
        if (!apiCtors)
            return invalidAPI;

        const apiCtor = apiCtors[apiName];
        if (!apiCtor)
            return invalidAPI;

        const api = Container.get<IApi>(apiCtor);
        Container.remove(apiCtor);
        return api;
    }

    /**
     * 创建APIFactory实例
     * 
     * @param dir api所在目录, 默认src/api
     */
    public static async create(dir: IODirectoryBase) {
        let apiCtors = {};
        const dirs = await dir.findDirectories();
        for (const r of dirs) {
            const files = await r.findFiles();
            apiCtors[r.name] = files.reduce((memo: { [key: string]: Function; }, cr) => {
                if (cr.name.includes('_it') || cr.name.includes('_test') || cr.name.includes('.d.ts'))
                    return memo;

                const api = require(cr.path);
                if (!api.default)
                    throw new Error(`未导出default: ${cr.path}`);

                const name = cr.name.split('.')[0];
                memo[name] = api.default;
                return memo;
            }, {});
        }
        return new APIFactory(apiCtors);
    }
}