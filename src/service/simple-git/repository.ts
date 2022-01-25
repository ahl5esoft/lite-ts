import buildGit from 'simple-git';

import { IGitRepository, IGitRepositoryData, IODirectoryBase } from '../..';

/**
 * simple-git
 */
export class SimpleGitRepository implements IGitRepository {
    private m_Branch: string;
    private m_Git = buildGit();

    private m_FullHttpUrl: string;
    protected get fullHttpUrl() {
        if (!this.m_FullHttpUrl)
            this.m_FullHttpUrl = this.m_Data.httpUrl.replace(`${this.m_Data.protocol}://`, `${this.m_Data.protocol}://${this.m_Data.username}:${this.m_Data.accessToken}@`)

        return this.m_FullHttpUrl;
    }

    public constructor(
        public dir: IODirectoryBase,
        private m_Data: IGitRepositoryData
    ) { }

    public async add(files: string | string[]) {
        await this.m_Git.add(files);
    }

    public async checkout(branch: string) {
        if (this.m_Branch == branch)
            return;

        await this.m_Git.checkout(branch);
        this.m_Branch = branch;
    }

    public async clone(branch: string) {
        await this.m_Git.clone(this.fullHttpUrl, this.dir.path, ['-b', branch]);
        this.m_Git.cwd(this.dir.path);
        this.m_Branch = branch;
    }

    public async commit(message: string) {
        await this.m_Git.commit(message);
    }

    public async initRemote() {
        this.m_Git.cwd(this.dir.path);
        await this.m_Git.init();

        await this.m_Git.addRemote('origin', this.fullHttpUrl);
    }

    public async pull(branch?: string) {
        if (branch)
            await this.m_Git.pull('origin', branch);
        else
            await this.m_Git.pull();
    }

    public async push(remote: string, branch: string) {
        await this.m_Git.push(remote, branch);
    }
}