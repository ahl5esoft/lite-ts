import * as multer from 'multer';
import { extname } from 'path';

import { FileUploadOption } from './file-upload';
import { MongoIDGenerator } from '../db/mongo';
import { APIGetter, nullAPI } from '../../api';

const idGenerator = new MongoIDGenerator();

export let middleware = {
    apiGetter: null,
    action: (req: any, resp: any, next: () => any): any => {
        const apiGetter = middleware.apiGetter as APIGetter;
        let api = apiGetter ? apiGetter.get(req.params.endpoint, req.params.name) : nullAPI;
        req.api = api;

        const option = api.$fileOption as FileUploadOption;
        if (!(option && middleware.uploadDirPath))
            return next();

        const upload = multer({
            storage: multer.diskStorage({
                destination: (_req: any, _file: any, cb: any): void => {
                    cb(null, middleware.uploadDirPath);
                },
                filename: (_req: any, file: Express.Multer.File, cb: any) => {
                    const ext = extname(file.originalname);
                    idGenerator.generate().then(res => {
                        cb(null, `${res}${ext}`);
                    }, cb);
                },
            }),
            limits: option.limit,
        });
        return (
            option.fields ? upload.fields(option.fields) : upload.single(option.name)
        )(req, resp, next);
    },
    uploadDirPath: ''
};