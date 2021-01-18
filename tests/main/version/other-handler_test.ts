import { strictEqual } from 'assert';

import { OSDirectory, OSFile } from '../../../io/os';
import { OtherHandler } from '../../../main/version/other-handler';

describe('main/version/other-handler.ts', (): void => {
    describe('.handling(ctx: Context): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            const dir = new OSDirectory(__dirname, 'other-handler');
            await dir.create();

            const file = new OSFile(dir.path, 'package.json');
            await file.write({
                version: '0.0.0'
            });

            const version = '1.1.1';
            let err: Error;
            try {
                await new OtherHandler(file.name).handle({
                    rootDir: dir,
                    version: version
                });
            } catch (ex) {
                err = ex;
            }

            const res = await file.readJSON<{ version: string; }>();
            await dir.remove();

            strictEqual(err, undefined);
            strictEqual(res.version, version);
        });
    });
});