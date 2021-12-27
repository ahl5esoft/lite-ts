import { EnumFacatoryBase, IParser, IValueData } from '../..';

export class ValueConsumeParser<T extends { text: string, value: number }> implements IParser {
    public constructor(
        private m_EnumFactory: EnumFacatoryBase,
        private m_Reg: RegExp,
        private m_ValueTypeModel: new () => T
    ) { }

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