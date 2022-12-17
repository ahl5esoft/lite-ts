import { IValueInterceptor } from '../../contract';

export class NullValueInterceptor implements IValueInterceptor {
    public async after() { }

    public async before() {
        return false;
    }
}