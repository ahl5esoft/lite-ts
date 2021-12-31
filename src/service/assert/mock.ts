import { deepStrictEqual } from 'assert';

class Record {
    public args = [];

    public returnValues = [];
}

export const mockAny: any = new Object();

/**
 * Mock对象
 * 
 * @example
 * ```typescript
 *  enum CarType {
 *      Mini,
 *      Benz
 *  }
 * 
 *  interface ICar {
 *      type: CarType;
 *      setDriver(person: IPerson): void;
 *      setSpeed(speed: number): void;
 *  }
 * 
 *  interface IPerson {
 *      drive(car: ICar): void;
 *  }
 * 
 *  class Person implements IPerson {
 *      public constructor(private m_IsDrunk = false) { }
 * 
 *      public drive(car: ICar) {
 *          car.setDriver(this.m_IsDrunk ? new ProxyPerson() : this);
 *          car.setSpeed(car.type == CarType.Mini ? 80 : 120);
 *      }
 *  }
 *  
 *  class ProxyPerson implements IPerson {
 *      public drive(car: ICar) {
 *          console.log(car);
 *      }
 *  }
 * 
 *  // stub
 *  const person = new Person();
 *  const mockMiniCar = new Mock<ICar>({
 *      type: CarType.Mini
 *  });
 *  mockMiniCar.expected.setSpeed(80);
 *  mockMiniCar.expected.setDriver(person);
 *  person.drive(mockMiniCar.actual);
 * 
 *  // fake
 *  const person = new Person(true);
 *  const mockMiniCar = new Mock<ICar>({
 *      type: CarType.Benz
 *  });
 *  mockMiniCar.expected.setSpeed(120);
 *  mockMiniCar.expected.setDriver(mockAny as any);
 *  person.drive(mockMiniCar.actual);
 * 
 *  class TestPromise {
 *      public constructor(private m_Car: ICar) { }
 * 
 *      public async do() {
 *          const car = await this.getCar();
 *          car.setSpeed(50);
 *      }
 * 
 *      public async getCar(): Promise<ICar> {
 *          return this.m_Car;
 *      }
 *  }
 * 
 *  // promise
 *  const mockCar = new Mock<ICar>();
 *  mockCar.expected.setSpeed(50);
 *  await new TestPromise(mockCar.actual).do();
 * ```
 */
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