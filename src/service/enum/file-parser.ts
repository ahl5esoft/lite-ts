import { IEnumItemData, IOFactoryBase, IParser } from '../..';

const boolAttrReg = /^\[(\w+)\]$/
const intAttrReg = /^\[(\w+)=(\d+)\]$/;
const stringAttrReg = /^\[(\w+)='(\w+)'\]$/;
const textReg = /^\s+\*\s+(\[.+\])?(.+)$/;
const valueReg = /^\s+\w+\s=\s(\d+),?$/;

export class EnumFileParser implements IParser {
    public constructor(
        private m_IOFactory: IOFactoryBase
    ) { }

    public async parse(filePath: string) {
        const file = this.m_IOFactory.buildFile(filePath);
        const content = await file.readString();
        const lines = content.split(/[\r\n]+/g);
        const res: IEnumItemData[] = [];
        let isBegin = false;
        for (const r of lines) {
            if (!isBegin) {
                isBegin = r.includes('{');
                continue;
            }

            if (r.includes('/*') || r.includes('*/'))
                continue;

            let match = r.match(textReg);
            if (match) {
                res.push({
                    text: match[2],
                    value: 0
                });

                this.setAttr(res[res.length - 1], match[1]);
                continue;
            }

            match = r.match(valueReg);
            if (match)
                res[res.length - 1].value = parseInt(match[1]);
        }
        return res;
    }

    private setAttr(entry: IEnumItemData, attr: string) {
        if (!attr)
            return;

        let match = attr.match(boolAttrReg);
        if (match) {
            entry[match[1]] = true;
            return;
        }

        match = attr.match(intAttrReg);
        if (match) {
            entry[match[1]] = parseInt(match[2]);
            return;
        }

        match = attr.match(stringAttrReg);
        if (match)
            entry[match[1]] = match[2];
    }
}