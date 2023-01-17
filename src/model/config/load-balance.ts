/**
 * 负载
 */
export class LoadBalance {
    public grpc: {
        [app: string]: {
            [env: string]: string | {
                /**
                 * 默认路由
                 */
                default: string;
                /**
                 * 余数
                 */
                mod: [string, number];
                /**
                 * 百分比
                 */
                percent: [string, number];
            };
        };
    };
    public http: {
        [app: string]: {
            [env: string]: string | {
                /**
                 * 默认路由
                 */
                default: string;
                /**
                 * 余数
                 */
                mod: [string, number];
                /**
                 * 百分比
                 */
                percent: [string, number];
            };
        };
    };
}
