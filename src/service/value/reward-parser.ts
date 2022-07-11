import { EnumFactoryBase, IParser, IValueData } from '../../contract';
import { enum_ } from '../../model';

interface IReward extends IValueData {
    weight: number;
}

/**
 * 数值奖励解析器
 */
export class ValueRewardParser<T extends enum_.ValueTypeData> implements IParser {
    /**
     * 构造函数
     * 
     * @param m_EnumFactory 枚举工厂
     * @param m_ValueTypeModel 枚举模型
     * @param m_Reg 匹配规则
     */
    public constructor(
        private m_EnumFactory: EnumFactoryBase,
        private m_ValueTypeModel: new () => T,
        private m_Reg = /^([^*]+)\*(-?\d+)(\*?(\d+))?$/,
    ) { }

    /**
     * 解析
     * 
     * @param text 奖励文本
     * 
     * @returns IReward[][]
     *
     * @example
     * ```typescript
     *  const enumFactory: EnumFactoryBase;
     *  const res = new ValueRewardParser(enumFactory, 数值类型枚举模型).parse(`A*-1
     * 
     *  A*2*99
     *  B*3*1`);
     *  // res = [
     *      [
     *          { count: -1, valueType: 11, weight: 0}
     *      ],
     *      [
     *          { count: 2, valueType: 11, weight: 99 },
     *          { count: 3, valueType: 22, weight: 1 }
     *      ]
     *  ];
     * ```
     */
    public async parse(text: string) {
        const lines = text.split(/\r\n|\n|\r/g);
        const res: IReward[][] = [[]];
        const valueTypeEnum = this.m_EnumFactory.build(this.m_ValueTypeModel);
        for (const r of lines) {
            const match = r.match(this.m_Reg);
            if (!match) {
                if (res[res.length - 1].length) {
                    res.push([]);
                    continue;
                }

                throw new Error(`无效奖励格式: ${text}`);
            }

            const enumItem = await valueTypeEnum.get(cr => {
                return cr.text == match[1];
            });
            if (!enumItem)
                throw new Error(`无效奖励名: ${r}`);

            const count = parseInt(match[2]);
            if (isNaN(count))
                throw new Error(`无效奖励数量: ${r}`);

            let weight = 0;
            if (match[3])
                weight = parseInt(match[4]) || 0;

            res[res.length - 1].push({
                count: count,
                valueType: enumItem.data.value,
                weight: weight
            });
        }
        return res;
    }
}