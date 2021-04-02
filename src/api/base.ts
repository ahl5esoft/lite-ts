import { validate } from 'class-validator';

import { APIResponse } from './response';
import { CustomError, ErrorCode } from '../error';
import { TraceSpanBase } from '../runtime';

export abstract class APIBase {
    public $route: string;

    public $user: any;

    public async getResposne(traceSpan?: TraceSpanBase): Promise<APIResponse> {
        let resp: APIResponse = {
            data: null,
            err: 0
        };
        try {
            const validateErrors = await validate(this);
            if (validateErrors.length) {
                const messages = validateErrors.map((r): string => {
                    return r.toString();
                });
                traceSpan?.addLabel('valid', messages);
                throw new CustomError(ErrorCode.Verify);
            }

            resp.data = await this.call();
        } catch (ex) {
            traceSpan?.addLabel('err', ex);
            if (ex instanceof CustomError) {
                resp.err = ex.code;
                if (ex.code == ErrorCode.Tip)
                    resp.data = ex.message;

                traceSpan?.addLabel('err', ex);
            } else {
                resp.err = ErrorCode.Panic;
                traceSpan?.addLabel('err', {
                    message: ex.message,
                    stack: ex.stack
                });
            }
        }
        return resp;
    }

    protected abstract call(): Promise<any>;
}