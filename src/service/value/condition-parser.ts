import { EnumFactoryBase, IParser } from '../../contract';
import { contract, enum_ } from '../../model';

export class ValueConditionParser implements IParser {
    public static reg = /^([^=><%-]+)(%|now-diff)*([=><]+)(-?\d+(\.?\d+)?)$/;

    public constructor(
        protected enumFactory: EnumFactoryBase,
    ) { }

    /**
     * 解析
     * 
     * @param text 文本内容
     * 
     * @example
     * ```typescript
     *  const parser: ValueConditionParser<枚举模型>;
     *  const res = parser.parse(`A=-15
     *  B>=-5
     * 
     *  C<=20`);
     *  // res = [
     *      [
     *          { count: -15, eq: '=', valueType: A的枚举值 },
     *          { count: -5, eq: '>=', valueType: B的枚举值 }
     *      ],
     *      [
     *          { count: 20, eq: '<=', valueType: C的枚举值 }
     *      ]
     *  ]
     * ```
     */
    public async parse(text: string) {
        const lines = text.split(/\r\n|\n|\r/g);
        let res: contract.IValueCondition[][] = [[]];
        const valueTypeEnum = this.enumFactory.build(enum_.ValueTypeData);
        for (const r of lines) {
            const match = r.match(ValueConditionParser.reg);
            if (!match) {
                if (res[res.length - 1].length) {
                    res.push([]);
                    continue;
                }

                throw new Error(`无效数值条件格式: ${r}`);
            }

            const enumItem = await valueTypeEnum.get(cr => {
                return cr.text == match[1];
            });
            if (!enumItem)
                throw new Error(`无效数值条件名: ${r}`);

            const count = Number(match[4]);
            if (isNaN(count))
                throw new Error(`无效数值条件数量: ${r}`);

            let op = match[3];
            if (match[2])
                op = match[2] + match[3];

            res[res.length - 1].push({
                count,
                op,
                valueType: enumItem.entry.value
            });
        }
        return res;
    }
}