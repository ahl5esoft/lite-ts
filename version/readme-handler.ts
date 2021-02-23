import { CORBase } from '../src/dp';
import { FileBase } from '../src/io';

export class ReadmeHandler extends CORBase {
    public constructor(private m_File: FileBase, private m_Version: string) {
        super();
    }

    public async handle(): Promise<void> {
        let text = await this.m_File.readString();
        text = text.replace(/version-(\d+\.\d+\.\d+)-green/, (text, match): string => {
            return text.replace(match, this.m_Version);
        });
        await this.m_File.write(text);
    }
}