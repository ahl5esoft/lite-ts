export abstract class ConfigLoaderBase {
    public abstract load<T>(ctor: new () => T): Promise<T>;
}