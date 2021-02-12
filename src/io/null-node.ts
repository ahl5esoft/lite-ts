import { IONodeBase } from './node-base';

export class IONullNode extends IONodeBase {
    public async exists(): Promise<boolean> {
        return false;
    }

    public async move(): Promise<void> {}

    public async remove(): Promise<void> {}
}
