import { Client, SFTPWrapper } from 'ssh2';

import { Ssh2Directory } from './directory';
import { Ssh2File } from './file';
import { FileFactoryBase } from '../../contract';

export class Ssh2FileFactory extends FileFactoryBase {
    public constructor(
        public fsFileFactory: FileFactoryBase,
        private m_Config: any,
    ) {
        super();
    }

    public buildDirectory(...paths: string[]) {
        return new Ssh2Directory(
            this,
            paths.join('/'),
        );
    }

    public buildFile(...paths: string[]) {
        return new Ssh2File(
            this,
            paths.join('/'),
        );
    }

    public async invokeSftp<T>(getMethodFunc: (sftp: SFTPWrapper) => (...args: any[]) => void, ...args: any[]) {
        return this.invokingSftp<T>(true, getMethodFunc, args);
    }

    public async invokeSftpWithCallback<T>(getMethodFunc: (sftp: SFTPWrapper) => (...args: any[]) => void, ...args: any[]) {
        return this.invokingSftp<T>(false, getMethodFunc, args);
    }

    private async invokingSftp<T>(hasCallback: boolean, getMethodFunc: (sftp: SFTPWrapper) => (...args: any[]) => void, args: any[]) {
        const client = new Client();
        await new Promise<void>((s, f) => {
            client.on('error', f).on('ready', s).connect(this.m_Config);
        });

        try {
            const sftp = await new Promise<SFTPWrapper>((s, f) => {
                client.sftp((err, res) => {
                    if (err)
                        return f(err);

                    s(res);
                });
            });
            if (!hasCallback)
                return getMethodFunc(sftp).apply(sftp, args) as T;

            return await new Promise<T>((s, f) => {
                args.push((err: Error, res: T) => {
                    if (err instanceof Error)
                        return f(err);

                    s(
                        (err ?? res) as T
                    );
                });
                getMethodFunc(sftp).apply(sftp, args);
            });
        } catch (ex) {
            throw ex;
        } finally {
            client.end();
        }
    }
}