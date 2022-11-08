import { IParser } from '../../contract';

export class JsonParser implements IParser {
    public async parse(text: string) {
        try {
            return JSON.parse(text);
        } catch (ex) {
            return {
                err: ex.message
            };
        }
    }
}