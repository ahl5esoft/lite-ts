import { CORBase } from '../contract';

export abstract class HandlerBase extends CORBase {
    public constructor(private m_Version: string) {
        super();
    }

    protected getVersion(version: string): string {
        const oldParts = version.split('.');
        let isReset = false;
        return this.m_Version.split('.').map((r, i) => {
            const oldValue = parseInt(oldParts[i]);
            let v: number;
            if (isReset) {
                v = -oldValue;
            } else {
                v = parseInt(r);
                if (v)
                    isReset = true;
            }
            return v + oldValue;
        }).join('.');
    }
}