import Container from 'typedi';

import { IAPI, invalidAPI } from './i-api';
import { IOFactoryBase } from '../io';

export class APIFactory {
    public constructor(private m_RootPath: string, private m_IOFactory: IOFactoryBase) { }

    public async build(endpoint: string, apiName: string): Promise<IAPI> {
        const dir = this.m_IOFactory.buildDirectory(this.m_RootPath, 'api');
        let isExist = await dir.exists();
        if (!isExist)
            return invalidAPI;

        const endpointDir = this.m_IOFactory.buildDirectory(dir.path, endpoint);
        isExist = await endpointDir.exists();
        if (!isExist)
            return invalidAPI;

        const apiFile = this.m_IOFactory.buildFile(endpointDir.path, apiName);
        let api: IAPI;
        try {
            const apiCtor: Function = require(apiFile.path).default;
            api = Container.get<IAPI>(apiCtor);
            Container.remove(apiCtor);
        } catch {
            api = invalidAPI;
        }
        return api;
    }
}