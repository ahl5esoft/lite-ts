import { validate } from 'class-validator';

import { APIResponse } from './response';
import { CustomError, ErrorCode } from '../error';

export abstract class APIBase {
    public $route: string;

    public $user: any;

    public async getResposne(): Promise<APIResponse> {
        let resp: APIResponse = {
            data: null,
            err: 0
        };
        try {
            const validateErrors = await validate(this);
            if (validateErrors.length) {
                const message = validateErrors.map((r): string => {
                    return r.toString();
                }).join('\n-');
                throw new CustomError(ErrorCode.Verify, message);
            }

            resp.data = await this.call();
        } catch (ex) {
            if (ex instanceof CustomError) {
                resp.err = ex.code;
                if (ex.code == ErrorCode.Tip)
                    resp.data = ex.message;
                else
                    console.log(ex.code, ex.message);
            } else {
                resp.err = ErrorCode.Panic;
                console.log('error', ex);
            }
        }
        return resp;
    }

    protected abstract call(): Promise<any>;
}