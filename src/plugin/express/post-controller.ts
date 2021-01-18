import { getMetadataStorage, validate } from 'class-validator';
import * as multer from 'multer';
import { extname } from 'path';
import { Body, JsonController, Post, Req, UseBefore } from 'routing-controllers';

import { ExpressServer, ExpressServerRunOption } from './server';
import { APIBase, APIError, APIErrorCode, APIGetter, APIResponse, FileOption } from '../../../api';
import { OSFile } from '../../../io/os';
import { IDGeneratorBase } from '../../../object';

async function removeUploadFiles(api: APIBase): Promise<void> {
    for (const r of Object.keys(api.$nameOfFiles)) {
        for (const cr of api.$nameOfFiles[r]) {
            await new OSFile(cr.path).remove();
        }
    }
}

export function newPostExpessServerRunOption(uploadDirPath: string, apiGetter: APIGetter, idGenerator: IDGeneratorBase): ExpressServerRunOption {
    return async (server: ExpressServer): Promise<void> => {
        const uploadFilter = (req: any, resp: any, next: () => any): any => {
            let api = apiGetter.get(req.params.endpoint, req.params.name);
            req.api = api;

            const option = api.$fileOption as FileOption;
            if (!(option && uploadDirPath))
                return next();

            const upload = multer({
                storage: multer.diskStorage({
                    destination: (_req: any, _file: any, cb: any): void => {
                        cb(null, uploadDirPath);
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
        };

        @JsonController()
        class PostController {
            @Post('/:endpoint/:name')
            @UseBefore(uploadFilter)
            public async post(
                @Body() body: any,
                @Req() req: any
            ): Promise<APIResponse> {
                let api = req.api as APIBase;
                if (api.$fileOption) {
                    if (api.$fileOption.fields) {
                        api.$nameOfFiles = req.files || {};
                    } else if (api.$fileOption.name && req.file) {
                        api.$nameOfFiles = {
                            [api.$fileOption.name]: [req.file],
                        };
                    } else {
                        api.$nameOfFiles = {};
                    }
                }

                getMetadataStorage().getTargetValidationMetadatas(api.constructor, undefined).forEach((r): void => {
                    api[r.propertyName] = body[r.propertyName];
                });

                let resp: APIResponse = {
                    data: '',
                    err: 0
                };
                try {
                    const errors = await validate(api);
                    if (errors.length)
                        throw new APIError(APIErrorCode.Verify);

                    resp.data = await api.call();
                } catch (ex) {
                    if (ex instanceof APIError) {
                        resp.err = ex.code;
                    } else {
                        resp.err = APIErrorCode.Panic;
                    }
                }

                removeUploadFiles(api).catch(console.error);

                return resp;
            }


            @Post('/:app/:endpoint/:name')
            @UseBefore(uploadFilter)
            public async proxyPost(
                @Body() body: any,
                @Req() req: any
            ): Promise<APIResponse> {
                return await this.post(body, req);
            }
        }

        server.controllers.push(PostController);
    };
}