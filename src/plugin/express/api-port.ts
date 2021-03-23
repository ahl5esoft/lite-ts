import { json } from 'body-parser';
import { validate } from 'class-validator';
import express from 'express';
import { Server } from 'http';
import moment from 'moment';

import { APIFactory, APIResponse, IAPIPort } from '../../api';
import { CustomError, ErrorCode } from '../../error';
import { FileBase } from '../../io';

export class ExpressAPIPort implements IAPIPort {
    private m_Server: Server;

    public constructor(
        private m_APIFactory: APIFactory,
        private m_PackageFile: FileBase,
        private m_Port: number,
    ) { }

    public close() {
        this.m_Server.close();
    }

    public async listen() {
        const pkg = await this.m_PackageFile.readJSON<{
            name: string;
            version: string;
        }>();
        const listenArgs: any[] = [this.m_Port, () => {
            console.log(`${pkg.name}(v${pkg.version})[${moment().format('YYYY-MM-DD HH:mm:ss')}]: ${this.m_Port}`);
        }];
        if (process.platform == 'win32')
            listenArgs.splice(1, 0, '127.0.0.1');

        this.m_Server = express().use(
            json()
        ).post('/:endpoint/:api', async (req, resp) => {
            let res = new APIResponse();
            try {
                const api = await this.m_APIFactory.build(req.params.endpoint, req.params.api);
                if (typeof req.body == 'string')
                    req.body = JSON.parse(req.body);
                Object.keys(req.body || {}).forEach(r => {
                    api[r] = req.body[r];
                });
                const errors = await validate(api);
                if (errors.length) {
                    const message = errors.map((r): string => {
                        return r.toString();
                    }).join('\n-');
                    throw new CustomError(ErrorCode.Verify, message);
                }

                res.data = await api.call();
                res.err = 0;
            } catch (ex) {
                if (ex instanceof CustomError) {
                    res.err = ex.code;
                    if (ex.code == ErrorCode.Tip)
                        res.data = ex.message;
                    else
                        console.log(ex.code, ex.message);
                } else {
                    res.err = ErrorCode.Panic;
                    console.log('error', ex);
                }
            } finally {
                resp.json(res);
            }
        }).listen(...listenArgs);
    }
}