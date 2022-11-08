import { IParser } from '../../contract';

export class JsonParser implements IParser {
    public async parse(text: string) {
        return JSON.parse(text);
    }
}