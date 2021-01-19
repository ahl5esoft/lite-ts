import * as express from 'express';
import { useExpressServer } from 'routing-controllers';

export class ExpressServer {
    public app = express();

    public controllers: Function[] = [];

    public exitActions: (() => void)[] = [];

    public staticDirPath: string;

    public constructor(private m_Branch: string, private m_Port: number) { }

    public async run(...options: ExpressServerRunOption[]): Promise<void> {
        process.on('SIGINT', (): void => {
            this.exitActions.forEach((r): void => {
                r();
            });
            process.exit(0);
        });

        for (const r of options) {
            await r(this);
        }

        const listenArgs: any[] = [
            this.m_Port,
            (): void => {
                console.log(`${this.m_Branch}:${this.m_Port}`);
            },
        ];
        if (this.m_Branch == 'local' || this.m_Branch == 'tests')
            listenArgs.splice(1, 0, '127.0.0.1');
        useExpressServer(this.app, {
            controllers: this.controllers,
        }).listen(...listenArgs);
    }
}

export type ExpressServerRunOption = (server: ExpressServer) => Promise<void>;