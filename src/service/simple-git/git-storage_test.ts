import { deepStrictEqual, strictEqual } from 'assert';

import { GitStorage as Self } from './git-storage';
import { Mock } from '..';
import { IGitRepository, IGitRepositoryData, IODirectoryBase, IOFactoryBase, StringGeneratorBase } from '../..';

describe('src/service/simple-git/git-storage.ts', () => {
    describe('.flush()', () => {
        it('ok', async () => {
            const mockIOFactory = new Mock<IOFactoryBase>();
            const self = new Self(mockIOFactory.actual, null);

            const mockDir = new Mock<IODirectoryBase>();
            Reflect.set(self, 'm_Dirs', [mockDir.actual]);

            mockDir.expected.remove();

            await self.flush();

            deepStrictEqual(
                Reflect.get(self, 'm_Dirs'),
                []
            );
        });
    });

    describe('.getRepository(data: IGitRepositoryData)', () => {
        it('ok', async () => {
            const mockIOFactory = new Mock<IOFactoryBase>();
            const mockStringGenerator = new Mock<StringGeneratorBase>();
            const self = new Self(mockIOFactory.actual, mockStringGenerator.actual);

            const dirname = 'dir';
            mockStringGenerator.expectReturn(
                r => r.generate(),
                dirname
            );

            const mockDir = new Mock<IODirectoryBase>();
            mockIOFactory.expectReturn(
                r => r.buildDirectory(
                    process.cwd(),
                    dirname
                ),
                mockDir.actual
            );

            const data: IGitRepositoryData = {
                accessToken: 'at',
                httpUrl: 'url',
                protocol: 'http',
                username: 'admin'
            };
            const mockGitRepo = new Mock<IGitRepository>();
            Reflect.set(self, 'createRepository', (iDir: IODirectoryBase, iData: IGitRepositoryData) => {
                strictEqual(iDir, mockDir.actual);
                deepStrictEqual(iData, data);
                return mockGitRepo.actual;
            });

            mockGitRepo.expected.clone('master');

            const res = await self.getRepository(data);
            strictEqual(res, mockGitRepo.actual);
            deepStrictEqual(
                Reflect.get(self, 'm_Dirs'),
                [mockDir.actual]
            );
            deepStrictEqual(
                Reflect.get(self, 'm_Repos'),
                {
                    [data.httpUrl]: res
                }
            );
        });
    });
});