import { validate } from 'class-validator';

import { IAPI } from './i-api';
import { APIOption } from './option';
import { CustomError, ErrorCode } from '../error';
import { LogFactory } from '../log';

export function validateAPIOption(logFactory: LogFactory): APIOption {
    return async function (api: IAPI, _: any) {
        const errors = await validate(api);
        if (errors.length) {
            const message = errors.map(r => {
                return r.toString();
            }).join('\n-');
            logFactory.build().title('validate').desc(message).warning();

            throw new CustomError(ErrorCode.Verify);
        }
    }
}