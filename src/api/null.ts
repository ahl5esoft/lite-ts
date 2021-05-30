import { IAPI } from './i-api';
import { CustomError, ErrorCode } from '../error';

export class NullAPI implements IAPI {
    public static err = new CustomError(ErrorCode.API);

    public async call(): Promise<void> {
        throw NullAPI.err;
    }
}