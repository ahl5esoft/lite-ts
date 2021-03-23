import { APIBase } from './base';
import { CustomError, ErrorCode } from '../error';

export class InvalidAPI extends APIBase {
    public static err = new CustomError(ErrorCode.API);

    protected async call() {
        throw InvalidAPI.err;
    }
}