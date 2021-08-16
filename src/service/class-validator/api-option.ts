import { validate } from 'class-validator';

import { APIOption } from '../api';
import { DefaultLogFactory } from '../default';
import { CustomError } from '../global';
import { IAPI } from '../../contract';
import { ErrorCode } from '../../model/enum';

export function classValidatorAPIOption(logFactory: DefaultLogFactory): APIOption {
    return async function (api: IAPI, _: any) {
        const errors = await validate(api);
        if (errors.length) {
            const message = errors.map(r => {
                return r.toString();
            }).join('\n-');
            logFactory.build().addLabel('title', 'validate').addLabel('message', message).warning();

            throw new CustomError(ErrorCode.verify);
        }
    }
}