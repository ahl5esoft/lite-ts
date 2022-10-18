import { HandlerBase } from './handler-base';
import { IFile } from '../contract';

export class JsonFileHandler extends HandlerBase {
    public constructor(
        private m_File: IFile,
        version: string
    ) {
        super(version);
    }

    public async handle() {
        const isExist = await this.m_File.exists();
        if (!isExist)
            return;

        const entry = await this.m_File.read<{
            version: string
        }>();
        entry.version = this.getVersion(entry.version);
        await this.m_File.write(
            JSON.stringify(entry, null, '\t'),
        );
    }
}