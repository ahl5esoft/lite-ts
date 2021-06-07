import { CORBase } from '../../dp';
import { FileBase } from '../../io';

const reg = /version-(\d+\.\d+\.\d+)-green/;

export class ReadmeHandler extends CORBase {
    public constructor(private m_File: FileBase, private m_Version: string) {
        super();
    }

    public async handle(): Promise<void> {
        let text = await this.m_File.readString();
        text = text.replace(reg, (text, match: string): string => {
            const oldVersionParts = match.split('.');
            const versionParts = this.m_Version.split('.');
            const version = oldVersionParts.map((r, i) => {
                return parseInt(r) + parseInt(versionParts[i]);
            }).join('.');
            return text.replace(match, version);
        });
        await this.m_File.write(text);
    }
}