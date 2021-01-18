import { existsSync } from 'fs';
import { join } from 'path';
import Container from 'typedi';

import { APIBase } from './base';
import { nullAPI } from './null';

export class APIGetter {
    private m_DirPath: string;

    public constructor(...pathArgs: string[]) {
        this.m_DirPath = join(...pathArgs);
    }

    public get(endpoint: string, name: string, version?: string): APIBase {
        const dirPath = join(this.m_DirPath, endpoint);
        let isExist = existsSync(dirPath);
        if (!isExist)
            return nullAPI;

        const filePath = join(dirPath, name);
        let ctor: Function;
        try {
            if (version)
                ctor = require(`${filePath}-${version}`).default;

            if (!ctor)
                ctor = require(filePath).default;
        } catch (ex) {
            console.error(ex);
            return nullAPI;
        }

        const instance = Container.get<APIBase>(ctor);
        Container.remove(ctor);
        return instance;
    }
}