import { TracingConfig, TracingOptions } from 'jaeger-client';

export class Default {
    public authSecretKey: string;
    public configModel: string;
    public distributedMongo: string;
    public enumModel: string;
    public enumSep: string;
    public grpcProtoFilePath: string;
    public log4js: any;
    public mongo: string;
    public name: string;
    public openTracing: {
        config: TracingConfig
        options: TracingOptions
    };
    public port: {
        grpc: number;
        http: number;
    };
    public redis: {
        host: string;
        port: number;
    };
    public version: string;
}