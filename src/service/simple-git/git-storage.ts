import { GitRepository } from './git-repository';
import { IGitRepository, IGitRepositoryData, IGitStorage, IODirectoryBase, IOFactoryBase, StringGeneratorBase } from '../..';

export class GitStorage implements IGitStorage {
    private m_Repos: { [key: string]: IGitRepository } = {};
    private m_Dirs: IODirectoryBase[] = [];

    public constructor(
        private m_IOFactory: IOFactoryBase,
        private m_StringGenerator: StringGeneratorBase
    ) { }

    public async flush() {
        for (const r of this.m_Dirs)
            await r.remove();

        this.m_Dirs = [];
    }

    public async getRepository(data: IGitRepositoryData) {
        if (!(data.httpUrl in this.m_Repos)) {
            const dir = this.m_IOFactory.buildDirectory(
                process.cwd(),
                await this.m_StringGenerator.generate(),
            );
            this.m_Dirs.push(dir);

            const repo = this.createRepository(dir, data);
            this.m_Repos[data.httpUrl] = repo;

            await repo.clone('master');
        }

        return this.m_Repos[data.httpUrl];
    }

    private createRepository(dir: IODirectoryBase, data: IGitRepositoryData) {
        return new GitRepository(dir, data);
    }
}