import { Context } from './context';
import { HandlerBase } from '../../dp/cor';
import { File } from '../../io/os';

const versionReg = /version-(\d+\.\d+\.\d+)-green/;

export class ReadmeHandler extends HandlerBase<Context> {
    public static filename = 'README.md';

    protected async handling(ctx: Context): Promise<void> {
        const readme = new File(ctx.rootDir.path, ReadmeHandler.filename);
        let text = await readme.readString();
        text = text.replace(versionReg, (match: string, version: string): string => {
            return match.replace(version, ctx.version);
        });
        await readme.write(text);
    }
}