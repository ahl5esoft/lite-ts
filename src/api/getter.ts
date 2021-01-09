import Container from 'typedi';

import { APIBase } from './base';
import { APIError } from './error';
import { APIErrorCode } from './error-code';
import { OSDirectory, OSFile } from '../io/os';

const err = new APIError(APIErrorCode.API);

export class APIGetter {
    public static get err(): Error {
        return err;
    }

    private m_Dir: OSDirectory;

    public constructor(...pathArgs: string[]) {
        this.m_Dir = new OSDirectory(...pathArgs);
    }

    public async get(endpoint: string, name: string, version?: string): Promise<APIBase> {
        const dir = new OSDirectory(this.m_Dir.path, endpoint);
        let isExist = await dir.isExist();
        if (!isExist)
            throw APIGetter.err;

        const file = new OSFile(dir.path, name);
        let ctor: Function;
        try {
            if (version)
                ctor = require(`${file.path}-${version}`).default;

            if (!ctor)
                ctor = require(file.path).default;
        } catch (ex) {
            console.error(ex);
            throw APIGetter.err;
        }

        const instance = Container.get<APIBase>(ctor);
        Container.remove(ctor);
        return instance;
    }
}