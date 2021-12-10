import { GitStorage } from './git-storage';
import { GitStorageFactoryBase, IOFactoryBase, StringGeneratorBase } from '../..';

export class SimpleGitStorageFactory extends GitStorageFactoryBase {
    public constructor(
        private m_IOFactory: IOFactoryBase,
        private m_StringGenerator: StringGeneratorBase
    ) {
        super();
    }

    public build() {
        return new GitStorage(this.m_IOFactory, this.m_StringGenerator);
    }
}