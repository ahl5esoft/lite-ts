import { Body, JsonController, Post, Req, UseBefore } from 'routing-controllers';

import { APIBase, APIError, APIErrorCode } from '../../api';
import { OSFile } from '../../io/os';
import { middleware } from './file-upload-middleware';

class Response {
    public err = 0;

    public data: any;
}

@JsonController()
export class PostController {
    @Post('/:endpoint/:name')
    @UseBefore(middleware.action)
    public async post(
        @Body() body: any,
        @Req() req: any
    ): Promise<Response> {
        const api = req.api as APIBase;

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

        api.$validations.forEach((r): void => {
            api[r.propertyName] = body[r.propertyName];
        });

        let resp = new Response();
        try {
            api.request = req;

            let ok = await api.auth();
            if (!ok)
                throw new APIError(APIErrorCode.Auth);

            ok = await api.valid();
            if (!ok)
                throw new APIError(APIErrorCode.Verify);

            resp.data = await api.call();
        } catch (ex) {
            if (ex instanceof APIError)
                resp.err = ex.code;
            else
                resp.err = APIErrorCode.Panic;
        } finally {
            this.removeFiles(api).catch(console.log);
        }
        return resp;
    }

    @Post('/:app/:endpoint/:name')
    @UseBefore(middleware.action)
    public async proxyPost(
        @Body() body: any,
        @Req() req: any
    ): Promise<Response> {
        return await this.post(body, req);
    }

    private async removeFiles(api: APIBase): Promise<void> {
        for (const r of Object.keys(api.$nameOfFiles)) {
            for (const cr of api.$nameOfFiles[r]) {
                await new OSFile(cr.path).remove();
            }
        }
    }
}
