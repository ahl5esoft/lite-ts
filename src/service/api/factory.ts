import Container from 'typedi';

import { CustomError } from '../global';
import { IODirectoryBase, IAPI } from '../../contract';
import { ErrorCode } from '../../model/enum';

const invalidAPIError = new CustomError(ErrorCode.api);
const invalidAPI: IAPI = {
    call: async () => {
        throw invalidAPIError;
    }
};


export class APIFactory {
    private constructor(private m_APICtors: { [key: string]: { [key: string]: Function; }; }) { }

    public build(endpoint: string, apiName: string) {
        const apiCtors = this.m_APICtors[endpoint];
        if (!apiCtors)
            return invalidAPI;

        const apiCtor = apiCtors[apiName];
        if (!apiCtor)
            return invalidAPI;

        const api = Container.get<IAPI>(apiCtor);
        Container.remove(apiCtor);
        return api;
    }

    public static async create(dir: IODirectoryBase) {
        let apiCtors = {};
        const dirs = await dir.findDirectories();
        for (const r of dirs) {
            const files = await r.findFiles();
            apiCtors[r.name] = files.reduce((memo: { [key: string]: Function; }, cr) => {
                if (cr.name.includes('_test'))
                    return memo;

                const name = cr.name.split('.')[0];
                const api = require(cr.path);
                if (!api.default)
                    throw new Error(`未导出default: ${cr.path}`);

                memo[name] = api.default;
                return memo;
            }, {});
        }
        return new APIFactory(apiCtors);
    }
}