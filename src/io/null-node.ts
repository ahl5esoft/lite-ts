import { IONodeBase } from './node-base';

export class IONullNode extends IONodeBase {
    public async exists(): Promise<boolean> {
        return false;
    }

    public async mv(): Promise<void> {}

    public async rm(): Promise<void> {}
}
