export interface IAPICaller {
    call<T>(route: string, body?: object, ms?: number): Promise<T>;
    voidCall(route: string, body?: object): void;
}