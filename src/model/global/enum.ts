export interface IEnumItemData {
    key: string;
    value: number;
}

export class Enum {
    public id: string;
    public items: IEnumItemData[];
}