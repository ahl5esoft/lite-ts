import { IODirectoryBase } from '.';

export interface IGitRepository {
    readonly dir: IODirectoryBase;

    add(files: string | string[]): Promise<void>;
    checkoutBranch(branch: string): Promise<void>;
    clone(branch: string): Promise<void>;
    commit(message: string): Promise<void>;
    initRemote(): Promise<void>;
    pull(branch: string): Promise<void>;
    push(remote: string, branch: string): Promise<void>;
}