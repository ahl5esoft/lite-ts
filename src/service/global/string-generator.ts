import { StringGeneratorBase } from '../../contract';

export class MathRandomStringGenerator extends StringGeneratorBase {
    public constructor(private m_Length: number) {
        super();
    }

    public async generate(): Promise<string> {
        return Math.random().toString(36).substr(2, this.m_Length);
    }
}