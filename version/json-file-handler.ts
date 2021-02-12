import { CORBase } from '../src/dp';
import { DirectoryBase, IOFactoryBase } from '../src/io';

class Entry {
    public version: string;
}

export class JsonFileHandler extends CORBase {
    public constructor(
        private m_IOFactory: IOFactoryBase,
        private m_Dir: DirectoryBase,
        private m_Filename: string,
        private m_Version: string
    ) {
        super();
    }

    public async handle(): Promise<void> {
        const file = this.m_IOFactory.buildFile(this.m_Dir.path, this.m_Filename);
        const isExist = await file.exists();
        if (!isExist)
            return;

        const entry = await file.readJSON<Entry>();
        entry.version = this.m_Version;
        await file.write(entry);
    }
}