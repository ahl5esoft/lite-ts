import { Request } from 'express';
import { Inject, Service } from 'typedi';

import { CustomError } from '../error';
import { CryptoBase, IApiSession } from '../../contract';
import { enum_ } from '../../model';

@Service()
export class ExpressApiSession<T> implements IApiSession {
    public static errAuth = new CustomError(enum_.ErrorCode.auth);

    @Inject(enum_.IoC.authCrypto)
    public authCrypt: CryptoBase;

    protected authData: T;

    public async initSession(req: Request) {
        if (req.headers[enum_.Header.authData]) {
            try {
                const plaintext = await this.authCrypt.decrypt(req.headers[enum_.Header.authData] as string);
                this.authData = JSON.parse(plaintext) as T;
                return;
            } catch { }
        }

        throw ExpressApiSession.errAuth;
    }
}