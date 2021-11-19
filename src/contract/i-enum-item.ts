export interface IEnumItem<T> {
    readonly data: T;
    readonly encodingKey: string;
    getCustomEncodingKey(attr: string): string;
}