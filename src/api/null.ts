import { APIBase } from './base';
import { APIError } from './error';
import { APIErrorCode } from './error-code';

class NullAPI extends APIBase {
    public async call(): Promise<void> {
        throw new APIError(APIErrorCode.API);
    }
}

export const nullAPI = new NullAPI();