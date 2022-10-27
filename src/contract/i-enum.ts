import { IEnumItem } from './i-enum-item';
import { contract } from '../model';

export interface IEnum<T extends contract.IEnumItem> {
    readonly allItem: Promise<{ [value: number]: IEnumItem<T> }>;
    readonly items: Promise<IEnumItem<T>[]>;
    get(predicate: (data: T) => boolean): Promise<IEnumItem<T>>;
    getReduce<TReduce>(typer: new () => TReduce): Promise<TReduce>;
}