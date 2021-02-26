import { CORBase } from '../../dp';
import { FileBase } from '../../io';

class Entry {
    public version: string;
}

export class JsonFileHandler extends CORBase {
    public constructor(
        private m_File: FileBase,
        private m_Version: string
    ) {
        super();
    }

    public async handle(): Promise<void> {
        const isExist = await this.m_File.exists();
        if (!isExist)
            return;

        const entry = await this.m_File.readJSON<Entry>();
        entry.version = this.m_Version;
        await this.m_File.write(entry);
    }
}