/**
 * 负载
 */
export class LoadBalance {
    public grpc: {
        [app: string]: {
            [env: string]: string
        }
    };
    public http: {
        [app: string]: {
            [env: string]: string
        }
    };
}