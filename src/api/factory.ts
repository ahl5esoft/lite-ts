import { APIBase } from './base';
import { InvalidAPI } from './invalid';
import { IOFactoryBase } from '../io';

const invalidAPI = new InvalidAPI();

export class APIFactory {
    public constructor(
        private m_DirPath: string,
        private m_IOFactory: IOFactoryBase,
        private m_BuildFunc: (filePath: string) => APIBase
    ) { }

    public async build(endpoint: string, apiName: string): Promise<APIBase> {
        const dir = this.m_IOFactory.buildDirectory(this.m_DirPath);
        let isExist = await dir.exists();
        if (!isExist)
            return invalidAPI;

        const endpointDir = this.m_IOFactory.buildDirectory(dir.path, endpoint);
        isExist = await endpointDir.exists();
        if (!isExist)
            return invalidAPI;

        const apiFile = this.m_IOFactory.buildFile(endpointDir.path, apiName);
        let api: APIBase;
        try {
            api = this.m_BuildFunc(apiFile.path);
        } catch {
            api = invalidAPI;
        }
        return api;
    }
}