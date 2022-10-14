import Container from 'typedi';

import { CustomError } from '../error';
import { ApiFactoryBase, IApi, IDirectory } from '../../contract';
import { enum_ } from '../../model';

const invalidAPIError = new CustomError(enum_.ErrorCode.api);
const invalidAPI: IApi = {
    call() {
        throw invalidAPIError;
    },
};

class ApiFactory extends ApiFactoryBase {
    public constructor(
        private m_APICtors: { [key: string]: { [key: string]: Function; }; }
    ) {
        super();
    }

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
}

export async function createApiFactory(dir: IDirectory) {
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
    return new ApiFactory(apiCtors);
}