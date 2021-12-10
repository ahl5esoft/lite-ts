import buildGit from 'simple-git';

import { IGitRepository, IGitRepositoryData, IODirectoryBase } from '../..';

export class GitRepository implements IGitRepository {
    private m_FullHttpUrl: string;
    private m_Git = buildGit();

    public constructor(
        public dir: IODirectoryBase,
        private m_Data: IGitRepositoryData
    ) { }

    public async add(files: string | string[]) {
        await this.m_Git.add(files);
    }

    public async checkoutBranch(branch: string) {
        await this.m_Git.checkoutBranch(branch, `remotes/origin/${branch}`);
    }

    public async clone(branch: string) {
        const httpUrl = await this.getFullHttpUrl();
        await this.m_Git.clone(httpUrl, this.dir.path, ['-b', branch]);
        this.m_Git.cwd(this.dir.path);
    }

    public async commit(message: string) {
        await this.m_Git.commit(message);
    }

    public async initRemote() {
        this.m_Git.cwd(this.dir.path);
        await this.m_Git.init();

        const httpUrl = await this.getFullHttpUrl();
        await this.m_Git.addRemote('origin', httpUrl);
    }

    public async pull(branch: string) {
        await this.m_Git.pull('origin', branch);
    }

    public async push(remote: string, branch: string) {
        await this.m_Git.push(remote, branch);
    }

    private async getFullHttpUrl() {
        if (!this.m_FullHttpUrl)
            this.m_FullHttpUrl = this.m_Data.httpUrl.replace(`${this.m_Data.protocol}://`, `${this.m_Data.protocol}://${this.m_Data.username}:${this.m_Data.accessToken}@`)

        return this.m_FullHttpUrl;
    }
}