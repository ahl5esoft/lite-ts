export interface IApiPort {
    listen(): Promise<void>;
}