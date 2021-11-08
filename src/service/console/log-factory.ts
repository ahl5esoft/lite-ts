import { Log } from './log';
import { LogFactoryBase } from '../..';

export class ConsoleLogFactory extends LogFactoryBase {
    public build() {
        return new Log();
    }
}