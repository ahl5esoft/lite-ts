import { deepStrictEqual, strictEqual } from 'assert';

import { FileBase, Mock, YmlConfig as Self } from '../../../src';

describe('src/service/yml/config.ts', () => {
    describe('.get<T>(group: string, key?: string): Promise<T>', () => {
        it('group', async () => {
            const mockFile = new Mock<FileBase>();
            const self = new Self(mockFile.actual);

            const doc = {
                g: {
                    a: 1
                }
            };
            mockFile.expectReturn(
                r => r.readString(),
                JSON.stringify(doc)
            );

            const res = await self.get('g');
            deepStrictEqual(res, doc.g);
        });

        it('group不存在', async () => {
            const mockFile = new Mock<FileBase>();
            const self = new Self(mockFile.actual);

            const doc = {};
            mockFile.expectReturn(
                r => r.readString(),
                JSON.stringify(doc)
            );

            const res = await self.get('g');
            strictEqual(res, undefined);
        });

        it('key', async () => {
            const mockFile = new Mock<FileBase>();
            const self = new Self(mockFile.actual);

            const doc = {
                g: {
                    k: 'aa'
                }
            };
            mockFile.expectReturn(
                r => r.readString(),
                JSON.stringify(doc)
            );

            const res = await self.get('g', 'k');
            strictEqual(res, doc.g.k);
        });

        it('key不存在', async () => {
            const mockFile = new Mock<FileBase>();
            const self = new Self(mockFile.actual);

            const doc = {};
            mockFile.expectReturn(
                r => r.readString(),
                JSON.stringify(doc)
            );

            const res = await self.get('g', 'k');
            strictEqual(res, undefined);
        });
    });
});