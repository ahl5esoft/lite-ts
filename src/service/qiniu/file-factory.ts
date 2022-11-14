import * as qiniu from 'qiniu';

import { QiniuDirectory } from './directory';
import { QiniuFile } from './file';
import { FileFactoryBase } from '../../contract';
import { config } from '../../model';

export class QiniuFileFactory extends FileFactoryBase {
    private m_FormUploader: qiniu.form_up.FormUploader;
    public get formUploader() {
        return new Promise<qiniu.form_up.FormUploader>(async (s, f) => {
            if (!this.m_FormUploader) {
                try {
                    const cfg = await this.config;
                    this.m_FormUploader = new qiniu.form_up.FormUploader(cfg);
                } catch (ex) {
                    return f(ex);
                }
            }

            s(this.m_FormUploader);
        });
    }

    private m_BuketManager: qiniu.rs.BucketManager;
    public get bucketManager() {
        return new Promise<qiniu.rs.BucketManager>(async (s, f) => {
            if (!this.m_BuketManager) {
                try {
                    const mac = await this.mac;
                    const cfg = await this.config;
                    this.m_BuketManager = new qiniu.rs.BucketManager(mac, cfg);
                } catch (ex) {
                    return f(ex);
                }
            }

            s(this.m_BuketManager);
        });
    }

    private m_Mac: qiniu.auth.digest.Mac;
    protected get mac() {
        return new Promise<qiniu.auth.digest.Mac>(async (s, f) => {
            if (!this.m_Mac) {
                try {
                    const cfg = await this.m_GetConfigFunc();
                    this.m_Mac = new qiniu.auth.digest.Mac(cfg.accessKey, cfg.secretKey);
                } catch (ex) {
                    return f(ex);
                }
            }

            s(this.m_Mac);
        });
    }

    private m_Config: qiniu.conf.Config;
    protected get config() {
        return new Promise<qiniu.conf.Config>(async (s, f) => {
            if (!this.m_Config) {
                try {
                    const cfg = await this.m_GetConfigFunc();
                    this.m_Config = new qiniu.conf.Config({
                        useCdnDomain: cfg.useCdnDomain,
                        useHttpsDomain: cfg.useHttpsDomain,
                        zone: qiniu.zone[cfg.zone]
                    });
                } catch (ex) {
                    return f(ex);
                }
            }

            s(this.m_Config);
        });
    }

    public constructor(
        private m_GetConfigFunc: () => Promise<config.Qiniu>,
    ) {
        super();
    }

    public buildFile(...paths: string[]) {
        return new QiniuFile(this, paths);
    }

    public buildDirectory(...paths: string[]) {
        return new QiniuDirectory(this, paths);
    }

    public async getToken(bucket: string, filePath: string) {
        const mac = await this.mac;
        return new qiniu.rs.PutPolicy({
            scope: [bucket, filePath].join(':')
        }).uploadToken(mac);
    }
}