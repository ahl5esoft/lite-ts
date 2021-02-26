import Container from 'typedi';

import { APIBase } from './base';
import { InvalidAPI } from './invalid';
import { OSDirectory } from '../os';

const invalidAPI = new InvalidAPI();

export class APIFactory {
    private m_APICtors: { [key: string]: { [key: string]: Function; }; } = {};

    public async build(endpoint: string, apiName: string): Promise<APIBase> {
        const apiCtors = this.m_APICtors[endpoint];
        if (!apiCtors)
            return invalidAPI;

        const apiCtor = apiCtors[apiName];
        if (!apiCtor)
            return invalidAPI;

        let api: APIBase;
        try {
            api = Container.get<APIBase>(apiCtor);
            Container.remove(apiCtor);
        } catch {
            api = invalidAPI;
        }
        return api;
    }

    public async init(dir: OSDirectory) {
        const dirs = await dir.findDirectories();
        for (const r of dirs) {
            const files = await r.findFiles();
            this.m_APICtors[r.name] = files.reduce((memo: { [key: string]: Function; }, cr) => {
                const name = cr.name.split('.')[0];
                memo[name] = require(cr.path).default;
                return memo;
            }, {});
        }
    }
}