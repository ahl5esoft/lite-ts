import { validate } from 'class-validator';

import { APIOption } from './option';
import { CustomError } from '../error';
import { LogFactory } from '../log';
import { IAPI } from '../../contract';
import { ErrorCode } from '../../model';

export function validateAPIOption(logFactory: LogFactory): APIOption {
    return async function (api: IAPI, _: any) {
        const errors = await validate(api);
        if (errors.length) {
            const message = errors.map(r => {
                return r.toString();
            }).join('\n-');
            logFactory.build().title('validate').desc(message).warning();

            throw new CustomError(ErrorCode.verify);
        }
    }
}