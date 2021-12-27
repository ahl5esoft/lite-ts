import { EnumFacatoryBase, IParser, IValueData } from '../..';

interface IReward extends IValueData {
    weight: number;
}

export class ValueRewardParser<T extends { text: string, value: number }> implements IParser {
    public constructor(
        private m_EnumFactory: EnumFacatoryBase,
        private m_Reg: RegExp,
        private m_ValueTypeModel: new () => T
    ) { }

    public async parse(text: string) {
        const lines = text.split(/[\r\n]/g);
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