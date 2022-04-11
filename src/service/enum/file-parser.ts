import { IEnumItemData, IOFactoryBase, IParser } from '../..';

/**
 * 枚举文件解析器
 */
export class EnumFileParser implements IParser {
    private m_BoolAttrReg = /^\[(\w+)\]/;
    /**
     * bool特性正则
     */
    public set boolAttrReg(v: RegExp) {
        this.m_BoolAttrReg = v;
    }

    private m_IntAttrReg = /^\[(\w+)=(\d+)\]/;
    /**
     * int特性正则
     */
    public set intAttrReg(v: RegExp) {
        this.m_IntAttrReg = v;
    }

    private m_KeyValueReg = /^\s+(\w+)\s=\s(\d+),?$/;
    /**
     * 枚举键值正则
     */
    public set keyValueReg(v: RegExp) {
        this.m_KeyValueReg = v;
    }

    private m_StringAttrReg = /^\[(\w+)='(\w+)'\]/;
    /**
     * string特性正则
     */
    public set stringAttrReg(v: RegExp) {
        this.m_StringAttrReg = v;
    }

    private m_TextReg = /^\s+\*\s+(\[.+\])*(.+)$/;
    /**
     * 枚举文本正则
     */
    public set textReg(v: RegExp) {
        this.m_TextReg = v;
    }

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

            let match = r.match(this.m_TextReg);
            if (match) {
                res.push({
                    key: '',
                    text: match[2],
                    value: 0
                });

                this.setAttr(res[res.length - 1], match[1]);
                continue;
            }

            match = r.match(this.m_KeyValueReg);
            if (match) {
                res[res.length - 1].key = match[1];
                res[res.length - 1].value = parseInt(match[2]);
            }
        }
        return res;
    }

    private setAttr(entry: IEnumItemData, attr: string) {
        if (!attr)
            return;

        let match: RegExpMatchArray;
        while (true) {
            try {
                match = attr.match(this.m_BoolAttrReg);
                if (match) {
                    entry[match[1]] = true;
                    continue;
                }

                match = attr.match(this.m_IntAttrReg);
                if (match) {
                    entry[match[1]] = parseInt(match[2]);
                    continue;
                }

                match = attr.match(this.m_StringAttrReg);
                if (match)
                    entry[match[1]] = match[2];
            } finally {
                if (match && match[0].length != attr.length)
                    attr = attr.substring(match[0].length);
                else
                    break;
            }
        }
    }
}