export abstract class IDGeneratorBase {
    public abstract generate(): Promise<string>;
}
