import { IGitRepository, IGitRepositoryData } from '.';

export interface IGitStorage {
    flush(): Promise<void>;
    getRepository(data: IGitRepositoryData): Promise<IGitRepository>;
}