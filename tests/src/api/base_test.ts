import { deepStrictEqual } from 'assert';
import { Length } from 'class-validator';

import { APIBase, ErrorCode } from '../../../src';

describe('src/api/base.ts', () => {
    describe('.getResposne(): Promise<APIResponse>', () => {
        it('validate error', async () => {
            class ValidateFailAPI extends APIBase {
                @Length(20, 32)
                public name: string;

                protected async call(): Promise<string> {
                    return 'ok';
                }
            }

            const res = await new ValidateFailAPI().getResposne();
            deepStrictEqual(res, {
                data: null,
                err: ErrorCode.Verify
            });
        });

        it('ok', async () => {
            class OKAPI extends APIBase {
                protected async call(): Promise<string> {
                    return 'ok';
                }
            }

            const res = await new OKAPI().getResposne();
            deepStrictEqual(res, {
                data: 'ok',
                err: 0
            });
        });
    });
});