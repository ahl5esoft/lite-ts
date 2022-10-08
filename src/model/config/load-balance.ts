export class LoadBalance {
    public grpc: {
        [app: string]: {
            [env: string]: string | {
                default: string;
                mod: [string, number];
            }
        }
    };
    public http: {
        [app: string]: {
            [env: string]: string | {
                default: string;
                mod: [string, number];
            }
        }
    };
}