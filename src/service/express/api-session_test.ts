import { strictEqual } from 'assert';

import { ExpressApiSession as Self } from './api-session';
import { Mock } from '../assert';
import { CryptoBase } from '../../contract';
import { enum_ } from '../../model';

describe('src/service/express/api-session.ts', () => {
    describe('.initSession(req: Request)', () => {
        it('ok', async () => {
            const self = new Self();

            const mockCrypt = new Mock<CryptoBase>();
            self.authCrypt = mockCrypt.actual;

            mockCrypt.expectReturn(
                r => r.decrypt('cipher-text'),
                '{}'
            );

            await self.initSession({
                header: (key: string) => {
                    strictEqual(key, enum_.Header.authData);
                    return 'cipher-text';
                }
            } as any);
        });

        it('err', async () => {
            const self = new Self();

            let err: Error;
            try {
                await self.initSession({
                    header: (key: string) => {
                        strictEqual(key, enum_.Header.authData);
                        return '';
                    }
                } as any);
            } catch (ex) {
                err = ex;
            }
            strictEqual(err, Self.errAuth);
        });
    });
});