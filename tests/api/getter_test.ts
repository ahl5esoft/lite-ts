import 'reflect-metadata';

import { ok, strictEqual } from 'assert';

import { APIBase, APIGetter } from '../../api';
import { nullAPI } from '../../api/null';
import { OSDirectory, OSFile } from '../../io/os';

const self = new APIGetter(__dirname);

describe('api/getter.ts', (): void => {
    describe('.get(endpoint: string, name: string, version?: string): Promise<Base>', (): void => {
        it('endpoint not exists', (): void => {
            const res = self.get('endpoint', '');
            strictEqual(res, nullAPI);
        });

        it('api not exists', async (): Promise<void> => {
            const dir = new OSDirectory(__dirname, 'endpoint');
            await dir.create();

            const res = self.get('endpoint', '');

            await dir.remove();

            strictEqual(res, nullAPI);
        });

        it('api', async (): Promise<void> => {
            const dir = new OSDirectory(__dirname, 'endpoint');
            await dir.create();

            const name = 'tests';
            await new OSFile(dir.path, `${name}.ts`).write(`import { APIBase } from '../../../api';

export default class TestsAPI extends APIBase {
    public async auth(): Promise<boolean> {
        return true;
    }

    public async call(): Promise<any> {
        return '';
    }

    public async valid(): Promise<boolean> {
        return true;
    }
}`);

            let api: APIBase;
            let err: Error;
            try {
                api = self.get(dir.name, name);
            } catch (ex) {
                err = ex;
            }

            await dir.remove();

            strictEqual(err, undefined);
            ok(api instanceof APIBase);
            strictEqual(
                await api.call(),
                ''
            );
        });

        it('api version', async (): Promise<void> => {
            const dir = new OSDirectory(__dirname, 'endpoint');
            await dir.create();

            const name = 'tests';
            const version = '1.0.0';
            await new OSFile(dir.path, `${name}-${version}.ts`).write(`import { APIBase } from '../../../api';

export default class TestsAPI extends APIBase {
    public async auth(): Promise<boolean> {
        return true;
    }

    public async call(): Promise<any> {
        return '${version}';
    }

    public async valid(): Promise<boolean> {
        return true;
    }
}`);

            let api: APIBase;
            let err: Error;
            try {
                api = self.get(dir.name, name, version);
            } catch (ex) {
                err = ex;
            }

            await dir.remove();

            strictEqual(err, undefined);
            ok(api instanceof APIBase);
            strictEqual(
                await api.call(),
                version
            );
        });
    });
});