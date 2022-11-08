import { IParser } from '../../contract';

export class NumberParser implements IParser {
    public async parse(text: string) {
        return Number(text);
    }
}