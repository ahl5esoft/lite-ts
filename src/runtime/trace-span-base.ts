import { Trace } from './trace';
import { StringGeneratorBase } from '../object';
import { NowTimeBase } from '../time';

class Model {
    public beganOn: number;

    public endedOn: number;

    public id = '';

    public labels: { [key: string]: any; } = {};

    public name = '';

    public parentID = '';

    public traceID = '';
}

export abstract class TraceSpanBase {
    private m_Entry = new Model();

    public constructor(
        protected nowTime: NowTimeBase,
        private m_StringGenerator: StringGeneratorBase,
        private m_Trace: Trace,
        name: string,
        parentID: string
    ) {
        this.m_Entry.name = name;
        this.m_Entry.parentID = parentID;
    }

    public addLabel(key: string, value: any) {
        this.m_Entry.labels[key] = value;
    }

    public async getID(): Promise<string> {
        if (!this.m_Entry.id)
            this.m_Entry.id = await this.m_StringGenerator.generate();

        return this.m_Entry.id;
    }

    public async begin() {
        this.m_Entry.beganOn = await this.getNowTime();
    }

    protected async getEntry(): Promise<Model> {
        return {
            ...this.m_Entry,
            endedOn: await this.getNowTime(),
            id: await this.getID(),
            traceID: await this.m_Trace.getID()
        };
    }

    protected async getNowTime(): Promise<number> {
        const unixNano = await this.nowTime.unixNano();
        return Math.floor(unixNano / 1000 / 1000);
    }

    public abstract end(): Promise<void>;
}