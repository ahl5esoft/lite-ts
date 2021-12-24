export interface IParser {
    parse(text: string): Promise<any>;
}