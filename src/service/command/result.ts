import { ICommandResult } from '../../contract';

export class CommandResult implements ICommandResult {
    public code: number;
    public errBf: string[] = [];
    public outBf: string[] = [];

    public get err() {
        return this.errBf.join('');
    }

    public get out() {
        return this.outBf.join('');
    }
}