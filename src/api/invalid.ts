import { APIBase } from './base';
import { CustomError, ErrorCode } from '../error';

export class InvalidAPI extends APIBase {
    public async call(): Promise<void> {
        throw new CustomError(ErrorCode.API);
    }
}