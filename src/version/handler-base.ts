import { CORBase } from '../contract';

export abstract class HandlerBase extends CORBase {
    public constructor(
        private m_Version: string,
    ) {
        super();
    }

    protected getVersion(version: string) {
        const parts = this.m_Version.split('.').map(r => {
            return parseInt(r);
        });
        const total = parts.reduce((memo, r) => {
            return memo + r;
        }, 0);
        return total != 1 ? this.m_Version : version.split('.').map((r, i) => {
            return parseInt(r) + parts[i];
        }).join('.');
    }
}