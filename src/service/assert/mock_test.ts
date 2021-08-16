import { Mock, mockAny } from './mock';

enum CarType {
    Mini,
    Benz
}

interface ICar {
    type: CarType;
    setDriver(person: IPerson): void;
    setSpeed(speed: number): void;
}

interface IPerson {
    drive(car: ICar): void;
}

class Person implements IPerson {
    public constructor(private m_IsDrunk = false) { }

    public drive(car: ICar) {
        car.setDriver(this.m_IsDrunk ? new ProxyPerson() : this);
        car.setSpeed(car.type == CarType.Mini ? 80 : 120);
    }
}

class ProxyPerson implements IPerson {
    public drive(car: ICar) {
        console.log(car);
    }
}

class TestPromise {
    public constructor(private m_Car: ICar) { }

    public async do() {
        const car = await this.getCar();
        car.setSpeed(50);
    }

    public async getCar(): Promise<ICar> {
        return this.m_Car;
    }
}

describe('src/service/assert/mock.ts', () => {
    describe('Person', () => {
        it('stub', () => {
            const person = new Person();

            const mockMiniCar = new Mock<ICar>({
                type: CarType.Mini
            });
            mockMiniCar.expected.setSpeed(80);
            mockMiniCar.expected.setDriver(person);

            person.drive(mockMiniCar.actual);
        });

        it('fake', () => {
            const person = new Person(true);

            const mockMiniCar = new Mock<ICar>({
                type: CarType.Benz
            });
            mockMiniCar.expected.setSpeed(120);
            mockMiniCar.expected.setDriver(mockAny as any);

            person.drive(mockMiniCar.actual);
        });
    });

    describe('Promise', () => {
        it('ok', async () => {
            const mockCar = new Mock<ICar>();
            mockCar.expected.setSpeed(50);
            await new TestPromise(mockCar.actual).do();
        });
    });
});