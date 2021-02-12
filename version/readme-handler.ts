import { CORBase } from '../src/dp';
import { DirectoryBase, IOFactoryBase } from '../src/io';

export class ReadmeHandler extends CORBase {
    public constructor(private m_IOFactory: IOFactoryBase, private m_Dir: DirectoryBase, private m_Version: string) {
        super();
    }

    public async handle(): Promise<void> {
        const file = this.m_IOFactory.buildFile(this.m_Dir.path, 'README.md');
        let text = await file.readString();
        text = text.replace(/version-(\d+\.\d+\.\d+)-green/, (text, match): string => {
            return text.replace(match, this.m_Version);
        });
        await file.write(text);
    }
}