import { notStrictEqual } from 'assert';

import { MultiUnitOfWork as Self } from './multi-unit-of-work';
import { Mock } from '../assert';
import { IUnitOfWork } from '../..';

describe('src/service/db/multi-unit-of-work.ts', () => {
    describe('.commit()', () => {
        it('ok', async () => {
            const mockUow = new Mock<IUnitOfWork>();
            const self = new Self({
                '1': mockUow.actual
            });

            mockUow.expected.commit();

            await self.commit();
        });

        it('第一个出错', async () => {
            const mockUow = new Mock<IUnitOfWork>();
            const self = new Self({
                '1': {
                    commit: async () => {
                        throw new Error('1');
                    }
                } as any,
                '2': mockUow.actual
            });

            mockUow.expected.commit();

            let err: Error;
            try {
                await self.commit();
            } catch (ex) {
                err = ex;
            }
            notStrictEqual(err, undefined);
        });
    });
});