import { Mock, mockAny } from '../../../src';

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

describe('src/assert/mock.ts', () => {
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
});