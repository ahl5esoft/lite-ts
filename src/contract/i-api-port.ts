export interface IAPIPort {
    listen(): Promise<void>;
}