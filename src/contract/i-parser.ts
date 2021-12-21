export interface IParser {
    parse<T>(text: string): Promise<T>;
}