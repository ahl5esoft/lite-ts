export interface IRpcCallOption {
    route: string;
    body?: { [key: string]: any; };
    header?: { [key: string]: string; };
}