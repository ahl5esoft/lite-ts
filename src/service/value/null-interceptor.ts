import { IValueInterceptor } from '../../contract';

/**
 * 空数值拦截器
 */
export class NullValueInterceptor implements IValueInterceptor {
    /**
     * 后置
     */
    public async after() { }

    /**
     * 前置
     * 
     * @returns 是否拦截
     */
    public async before() {
        return false;
    }
}