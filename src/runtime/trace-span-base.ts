import { StringGeneratorBase } from '../object';
import { NowTimeBase } from '../time';

export abstract class TraceSpanBase {
    private m_Labels: { [key: string]: any } = {};

    public constructor(
        private m_NowTime: NowTimeBase,
        private m_StringGenerator: StringGeneratorBase,
    ) { }

    public addLabel(key: string, value: any) {
        this.m_Labels[key] = value;
    }

    public async end() {
        const unixNano = await this.m_NowTime.unixNano();
        this.addLabel(
            'endedOn',
            Math.floor(unixNano / 1000 / 1000)
        );
        this.addLabel(
            'id',
            await this.getID(),
        );
        await this.onEnd(this.m_Labels);
    }

    public async getID(): Promise<string> {
        if (!this.m_Labels.id)
            this.m_Labels.id = await this.m_StringGenerator.generate();

        return this.m_Labels.id;
    }

    protected abstract onEnd(labels: { [key: string]: any }): Promise<void>;
}