import { HandlerBase } from './handler-base';
import { FileBase } from '../../io';

const reg = /version-(\d+\.\d+\.\d+)-green/;

export class ReadmeHandler extends HandlerBase {
    public constructor(private m_File: FileBase, version: string) {
        super(version);
    }

    public async handle(): Promise<void> {
        let text = await this.m_File.readString();
        text = text.replace(reg, (text, match: string): string => {
            const version = this.getVersion(match);
            return text.replace(match, version);
        });
        await this.m_File.write(text);
    }
}