import { EnumFactoryBase, IParser } from '../../contract';
import { contract, enum_ } from '../../model';

export class ValueParser implements IParser {
    public constructor(
        protected enumFactory: EnumFactoryBase,
        private m_Reg = /^(.+)\*(-?\d+)$/,
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
        const lines = text.split(/\r\n|\n|\r/g);
        const res: contract.IValue[] = [];
        const valueTypeEnum = this.enumFactory.build(enum_.ValueTypeData);
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
            if (isNaN(count))
                throw new Error(`无效数值消费数量: ${r}`);

            res.push({
                count,
                valueType: enumItem.entry.value
            });
        }
        return res;
    }
}