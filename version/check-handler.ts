import { CORBase } from '../src/dp';

const reg = /\d+\.\d+\.\d+/;

export class CheckHandler extends CORBase {
    public constructor(private m_Version: string) {
        super();
    }

    public async handle(): Promise<void> {
        const ok = reg.test(this.m_Version);
        if (!ok)
            throw new Error(`无效版本号: ${this.m_Version}`);

        return super.handle();
    }
}