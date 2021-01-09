import 'reflect-metadata';

import { ok, strictEqual } from 'assert';

import { APIError, APIBase, APIGetter } from '../../api';
import { OSDirectory, OSFile } from '../../io/os';

const self = new APIGetter(__dirname);

describe('src/api/getter.ts', (): void => {
    describe('.get(endpoint: string, name: string, version?: string): Promise<Base>', (): void => {
        it('endpoint not exists', async (): Promise<void> => {
            let err: APIError;
            try {
                await self.get('endpoint', '');
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, APIGetter.err);
        });

        it('api not exists', async (): Promise<void> => {
            const dir = new OSDirectory(__dirname, 'endpoint');
            await dir.create();

            let err: APIError;
            try {
                await self.get('endpoint', '');
            } catch (ex) {
                err = ex;
            }

            await dir.remove();

            strictEqual(err, APIGetter.err);
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
                api = await self.get(dir.name, name);
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
                api = await self.get(dir.name, name, version);
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