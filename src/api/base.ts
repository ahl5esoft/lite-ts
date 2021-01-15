export abstract class APIBase {
    public $nameOfFiles: { [key: string]: any[]; } = {};

    public get $fileOption(): any {
        return;
    }

    public abstract call(): Promise<any>;
}