import { EnumFacatoryBase, IParser, IValueData } from '../..';

/**
 * 数值消耗解析器
 */
export class ValueConsumeParser<T extends { text: string, value: number }> implements IParser {
    /**
     * 构造函数
     * 
     * @param m_EnumFactory 枚举工厂
     * @param m_ValueTypeModel 枚举模型
     * @param m_Reg 匹配规则
     */
    public constructor(
        private m_EnumFactory: EnumFacatoryBase,
        private m_ValueTypeModel: new () => T,
        private m_Reg = /^(.+)\*-(\d+)$/,
    ) { }

    /**
     * 解析
     * 
     * @param text 文本内容
     * 
     * @returns IValueData[]
     * 
     * @example
     * ```typescript
     *  const parser: ValueConsumeParser<枚举模型>;
     *  const res = parser.parse(`A*-15
     *  B*-5`);
     *  // res = [
     *      { count: -15, valueType: 11 },
     *      { count: -5, valueType: 22, }
     *  ]
     * ```
     */
    public async parse(text: string) {
        const lines = text.split(/[\r\n]/g);
        const res: IValueData[] = [];
        const valueTypeEnum = this.m_EnumFactory.build(this.m_ValueTypeModel);
        for (const r of lines) {
            const match = r.match(this.m_Reg);
            if (!match)
                throw new Error(`无效数值消费格式: ${r}`);

            const enumItem = await valueTypeEnum.get(cr => {
                return cr.text == match[1];
            });
            if (!enumItem)
                throw new Error(`无效数值消费名: ${r}`);

            const count = parseInt(match[2]);
            if (isNaN(count) || count == 0)
                throw new Error(`无效数值消费数量: ${r}`);

            res.push({
                count: count > 0 ? -count : count,
                valueType: enumItem.data.value
            });
        }
        return res;
    }
}