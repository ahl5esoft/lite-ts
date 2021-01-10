import { Context } from './context';
import { CORHandlerBase } from '../../dp/cor';
import { OSFile } from '../../io/os';

class Package {
    public version: string;
}

export class OtherHandler extends CORHandlerBase {
    public constructor(private m_Filename: string) {
        super();
    }

    protected async handling(ctx: Context): Promise<void> {
        const file = new OSFile(ctx.rootDir.path, this.m_Filename);
        let pkg = await file.readJSON<Package>();
        pkg.version = ctx.version;
        pkg = Object.keys(pkg).sort().reduce((memo, r): object => {
            memo[r] = pkg[r];
            return memo;
        }, {}) as Package;
        await file.write(
            JSON.stringify(pkg, null, '\t')
        );
    }
}