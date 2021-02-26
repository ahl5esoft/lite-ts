export abstract class APIBase {
    public $route: string;

    public $user: any;

    public abstract call(): Promise<any>;
}