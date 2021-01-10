import { APIBase } from './base';

class NullAPI extends APIBase {
    public async auth(): Promise<boolean> {
        return false;
    }

    public async call(): Promise<void> { }

    public async valid(): Promise<boolean> {
        return false;
    }
}

export const nullAPI = new NullAPI();