import { APIBase } from '../../../api';

export default class OneAPI extends APIBase {
    public async call(): Promise<string> {
        return "one";
    }
}