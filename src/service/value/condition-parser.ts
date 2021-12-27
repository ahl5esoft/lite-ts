import { EnumFacatoryBase, IParser, IValueConditionData } from '../..';

export class ValueConditionParser<T extends { text: string, value: number }> implements IParser {
    public static reg = /^([^=><]+)([=><]+)(-?\d+)$/;

    public constructor(
        private m_EnumFactory: EnumFacatoryBase,
        private m_ValueTypeModel: new () => T
    ) { }

    public async parse(text: string) {
        let res: IValueConditionData[] = [];
        const lines = text.split(/[\r\n]/g);
        const valueTypeEnum = this.m_EnumFactory.build(this.m_ValueTypeModel);
        for (const r of lines) {
            const match = r.match(ValueConditionParser.reg);
            if (!match)
                throw new Error(`无效数值条件格式: ${r}`);

            const enumItem = await valueTypeEnum.get(cr => {
                return cr.text == match[1];
            });
            if (!enumItem)
                throw new Error(`无效数值条件名: ${r}`);

            const count = parseInt(match[3]);
            if (isNaN(count))
                throw new Error(`无效数值条件数量: ${r}`);

            res.push({
                count: count,
                op: match[2],
                valueType: enumItem.data.value
            });
        }
        return res;
    }
}