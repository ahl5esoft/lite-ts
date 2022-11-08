import { IParser } from '../../contract';

export class DefaultParser implements IParser {
    public async parse(text: string) {
        return text;
    }
}