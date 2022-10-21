import { StringGeneratorBase } from '../../contract';

export class MathStringGenerator extends StringGeneratorBase {
    public constructor(
        private m_Radix: number,
        private m_Length: number
    ) {
        super();
    }

    public async generate() {
        let str = '';
        while (str.length < this.m_Length) {
            str = Math.random().toString(this.m_Radix).substring(2);
        }
        return str.substring(0, this.m_Length);
    }
}