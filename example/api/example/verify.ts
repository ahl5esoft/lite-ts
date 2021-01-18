import { Length } from 'class-validator';

import { APIBase } from '../../../api';

export default class VerifyAPI extends APIBase {
    @Length(1, 10)
    public name: string;

    public async call(): Promise<string> {
        return `hello, ${this.name}`;
    }
}