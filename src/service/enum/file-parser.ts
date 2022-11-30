import { FileFactoryBase, IParser } from '../../contract';
import { enum_ } from '../../model';

export class EnumFileParser implements IParser {
    private m_BoolAttrReg = /^\[([a-zA-Z.]+)\]/;
    public set boolAttrReg(v: RegExp) {
        this.m_BoolAttrReg = v;
    }

    private m_IntAttrReg = /^\[([a-zA-Z.]+)=([0-9_]+)\]/;
    public set intAttrReg(v: RegExp) {
        this.m_IntAttrReg = v;
    }

    private m_KeyValueReg = /^\s+(\w+)\s=\s([0-9_]+),?$/;
    public set keyValueReg(v: RegExp) {
        this.m_KeyValueReg = v;
    }

    private m_StringAttrReg = /^\[([a-zA-Z.]+)='(\w+)'\]/;
    public set stringAttrReg(v: RegExp) {
        this.m_StringAttrReg = v;
    }

    private m_TextReg = /^\s+\*\s+(\[.+\])*(.+)$/;
    public set textReg(v: RegExp) {
        this.m_TextReg = v;
    }

    public constructor(
        private m_FileFactory: FileFactoryBase,
    ) { }

    public async parse(filePath: string) {
        const file = this.m_FileFactory.buildFile(filePath);
        const content = await file.readString();
        const lines = content.split(/[\r\n]+/g);
        const res: enum_.ItemData[] = [];
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

    private parseAttr(entry: enum_.ItemData, attr: string) {
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

    private setAtttr(entry: enum_.ItemData, k: string, v: any) {
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