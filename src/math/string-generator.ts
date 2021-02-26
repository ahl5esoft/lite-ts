import { StringGeneratorBase } from '../object';

export class RandomStringGenerator extends StringGeneratorBase {
    public constructor(private m_Length: number) {
        super();
    }

    public async generate(): Promise<string> {
        return Math.random().toString(36).substr(2, this.m_Length);
    }
}