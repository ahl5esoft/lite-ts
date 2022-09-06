/**
 * 负载
 */
export class LoadBalance {
    public http: { [app: string]: string };
    public grpc: { [app: string]: string };
}