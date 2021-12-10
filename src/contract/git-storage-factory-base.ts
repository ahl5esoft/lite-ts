import { IGitStorage } from '.';

export abstract class GitStorageFactoryBase {
    public abstract build(): IGitStorage;
}