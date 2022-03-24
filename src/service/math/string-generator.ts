import { StringGeneratorBase } from '../..';

/**
 * 随机字符串生成器
 */
export class MathStringGenerator extends StringGeneratorBase {
    /**
     * 构造函数
     * 
     * @param m_Radix 进制
     * @param m_Length 生成长度
     */
    public constructor(
        private m_Radix: number,
        private m_Length: number
    ) {
        super();
    }

    /**
     * 生成字符串
     */
    public async generate() {
        return Math.random().toString(this.m_Radix).substring(2, this.m_Length + 2);
    }
}