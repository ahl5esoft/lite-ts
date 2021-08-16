import { HandlerBase } from './handler-base';
import { IOFileBase } from '../contract';

class Entry {
    public version: string;
}

export class JsonFileHandler extends HandlerBase {
    public constructor(
        private m_File: IOFileBase,
        version: string
    ) {
        super(version);
    }

    public async handle(): Promise<void> {
        const isExist = await this.m_File.exists();
        if (!isExist)
            return;

        const entry = await this.m_File.readJSON<Entry>();
        entry.version = this.getVersion(entry.version);
        await this.m_File.write(entry);
    }
}