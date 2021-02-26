import { CORBase } from '../../dp';
import { FileBase } from '../../io';

const reg = /version-(\d+\.\d+\.\d+)-green/;

export class ReadmeHandler extends CORBase {
    public constructor(private m_File: FileBase, private m_Version: string) {
        super();
    }

    public async handle(): Promise<void> {
        let text = await this.m_File.readString();
        text = text.replace(reg, (text, match): string => {
            return text.replace(match, this.m_Version);
        });
        await this.m_File.write(text);
    }
}