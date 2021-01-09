import { APIErrorCode } from './error-code';

export class APIError extends Error {
    public constructor(public code: APIErrorCode, message?: string) {
        super(message);
    }
}
