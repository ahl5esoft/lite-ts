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
        const cipherText = req.header(enum_.Header.authData);
        if (cipherText) {
            const plaintext = await this.authCrypt.decrypt(cipherText);
            this.authData = JSON.parse(plaintext) as T;
            return;
        }

        throw ExpressApiSession.errAuth;
    }
}