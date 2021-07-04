export abstract class ConfigBase {
    public abstract get<T>(group: string, key?: string): Promise<T>;
}