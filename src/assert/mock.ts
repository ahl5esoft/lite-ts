import { deepStrictEqual } from 'assert';

class Record {
    public args = [];

    public returnValues = [];
}

export const mockAny: any = new Object();

export class Mock<T> {
    private m_CurrentKey: string;
    private m_Records: { [key: string]: Record; } = {};

    private m_Actutal = null;
    public get actual(): T {
        if (!this.m_Actutal) {
            this.m_Actutal = new Proxy(this.m_Target, {
                get: (target: any, key: string) => {
                    if (key in target)
                        return target[key];

                    if (key == 'then' || key == 'catch')
                        return this.m_Actutal;

                    return (...args: any[]) => {
                        const record = this.m_Records[key];
                        if (!(record && record.args.length))
                            throw new Error(`${key}未被调用`);

                        const recordArgs = record.args.shift();
                        deepStrictEqual(
                            args.map((r, i) => {
                                return recordArgs[i] == mockAny ? mockAny : r;
                            }),
                            recordArgs
                        );
                        return record.returnValues.shift();
                    };
                }
            });
        }

        return this.m_Actutal as T;
    }

    private m_Expected = new Proxy({}, {
        get: (_: any, key: string) => {
            this.m_CurrentKey = key;
            if (!this.m_Records[key])
                this.m_Records[key] = new Record();

            return (...args: any[]) => {
                this.m_Records[key].args.push(args);
            };
        }
    });
    public get expected(): T {
        return this.m_Expected as T;
    }

    public constructor(private m_Target = {}) { }

    public expectReturn(action: (target: T) => any, returnValue: any) {
        action(this.expected);
        this.m_Records[this.m_CurrentKey].returnValues.push(returnValue);
    }
}