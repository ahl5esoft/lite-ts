import { strictEqual } from 'assert';
import { CORBase } from '../../../src/dp';

class TestHandler extends CORBase {
    public constructor(private m_Action: (handler: CORBase) => void) {
        super();
    }

    public async handle(): Promise<void> {
        this.m_Action(this);
        return super.handle();
    }
}

describe('src/dp/cor-base.ts', (): void => {
    describe('.handle(): Promise<void>', (): void => {
        it('ok', async (): Promise<void> => {
            let count = 0;
            await new TestHandler((): void => {
                count++;
            }).setNext(
                new TestHandler((): void => {
                    count += 2;
                })
            ).setNext(
                new TestHandler((): void => {
                    count += 3;
                })
            ).handle();
            strictEqual(count, 6);
        });
        
        it('first break', async (): Promise<void> => {
            let count = 0;
            await new TestHandler((self: CORBase): void => {
                count++;
                self.break = true;
            }).setNext(
                new TestHandler((): void => {
                    count += 2;
                })
            ).setNext(
                new TestHandler((): void => {
                    count += 3;
                })
            ).handle();
            strictEqual(count, 1);
        });
        
        it('second break', async (): Promise<void> => {
            let count = 0;
            await new TestHandler((): void => {
                count++;
            }).setNext(
                new TestHandler((self: CORBase): void => {
                    count += 2;
                    self.break = true;
                })
            ).setNext(
                new TestHandler((): void => {
                    count += 3;
                })
            ).handle();
            strictEqual(count, 3);
        });
    });
});