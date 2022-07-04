import { IEnumItemData, IOFactoryBase, IParser } from '../..';

/**
 * 枚举文件解析器
 */
export class EnumFileParser implements IParser {
    private m_BoolAttrReg = /^\[([a-zA-Z.]+)\]/;
    /**
     * bool特性正则
     */
    public set boolAttrReg(v: RegExp) {
        this.m_BoolAttrReg = v;
    }

    private m_IntAttrReg = /^\[([a-zA-Z.]+)=([0-9_]+)\]/;
    /**
     * int特性正则
     */
    public set intAttrReg(v: RegExp) {
        this.m_IntAttrReg = v;
    }

    private m_KeyValueReg = /^\s+(\w+)\s=\s([0-9_]+),?$/;
    /**
     * 枚举键值正则
     */
    public set keyValueReg(v: RegExp) {
        this.m_KeyValueReg = v;
    }

    private m_StringAttrReg = /^\[([a-zA-Z.]+)='(\w+)'\]/;
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

    /**
     * 构造函数
     * 
     * @param m_IOFactory io工厂
     */
    public constructor(
        private m_IOFactory: IOFactoryBase
    ) { }

    /**
     * 解析
     * 
     * @param filePath 文件
     */
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

                this.parseAttr(res[res.length - 1], match[1]);
                continue;
            }

            match = r.match(this.m_KeyValueReg);
            if (match) {
                res[res.length - 1].key = match[1];
                res[res.length - 1].value = parseInt(
                    match[2].replace(/_/g, '')
                );
            }
        }
        return res;
    }

    /**
     * 解析特性
     * 
     * @param entry 实体
     * @param attr 特性
     */
    private parseAttr(entry: IEnumItemData, attr: string) {
        if (!attr)
            return;

        let match: RegExpMatchArray;
        while (true) {
            try {
                match = attr.match(this.m_BoolAttrReg);
                if (match) {
                    this.setAtttr(entry, match[1], true);
                    continue;
                }

                match = attr.match(this.m_IntAttrReg);
                if (match) {
                    this.setAtttr(
                        entry,
                        match[1],
                        parseInt(
                            match[2].replace(/_/g, '')
                        )
                    );
                    continue;
                }

                match = attr.match(this.m_StringAttrReg);
                if (match)
                    this.setAtttr(entry, match[1], match[2]);
            } finally {
                if (match && match[0].length != attr.length)
                    attr = attr.substring(match[0].length);
                else
                    break;
            }
        }
    }

    /**
     * 设置特性
     * 
     * @param entry 实体
     * @param k 键
     * @param v 值
     */
    private setAtttr(entry: IEnumItemData, k: string, v: any) {
        const keys = k.split('.');
        let temp = entry;
        keys.forEach((r, i) => {
            if (i == keys.length - 1) {
                temp[r] = v;
            } else {
                temp[r] ??= {};
                temp = temp[r];
            }
        });
    }
}