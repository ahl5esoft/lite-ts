import { CustomError, ErrorCode } from '../error';

export interface IAPI {
    call(): Promise<any>;
}

export const invalidAPI: IAPI = {
    call: async (): Promise<void> => {
        throw new CustomError(ErrorCode.API);
    }
};