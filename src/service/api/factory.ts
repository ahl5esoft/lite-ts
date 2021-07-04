import Container from 'typedi';

import { CustomError } from '../error';
import { DirectoryBase, IAPI } from '../../contract';
import { ErrorCode } from '../../model/enum';

const invalidAPIError = new CustomError(ErrorCode.API);
const nullAPI: IAPI = {
    call: async () => {
        throw invalidAPIError;
    }
};


export class APIFactory {
    private m_APICtors: { [key: string]: { [key: string]: Function; }; } = {};

    public build(endpoint: string, apiName: string): IAPI {
        const apiCtors = this.m_APICtors[endpoint];
        if (!apiCtors)
            return nullAPI;

        const apiCtor = apiCtors[apiName];
        if (!apiCtor)
            return nullAPI;

        let api: IAPI;
        try {
            api = Container.get<IAPI>(apiCtor);
            Container.remove(apiCtor);
        } catch {
            api = nullAPI;
        }
        return api;
    }

    public async init(dir: DirectoryBase) {
        const dirs = await dir.findDirectories();
        for (const r of dirs) {
            const files = await r.findFiles();
            this.m_APICtors[r.name] = files.reduce((memo: { [key: string]: Function; }, cr) => {
                const name = cr.name.split('.')[0];
                const api = require(cr.path);
                if (!api.default)
                    throw new Error(`未导出default: ${cr.path}`);

                memo[name] = api.default;
                return memo;
            }, {});
        }
    }
}