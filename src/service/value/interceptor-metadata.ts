import { IValueInterceptor } from '../../contract';

/**
 * 数值拦截元数据
 */
export const valueInterceptorMetadata = {
    /**
     * 断言
     */
    predicates: [] as {
        /**
         * 构造函数
         */
        ctor: new () => IValueInterceptor,
        /**
         * 断言
         */
        predicate: (valueType: number) => Promise<boolean>
    }[],
    /**
     * 数值类型
     */
    valueType: {} as { [valueType: number]: new () => IValueInterceptor }
}