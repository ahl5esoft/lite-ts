import { IApi } from '../../../../src';

/**
 * 获取版本
 */
export default class VersionApi implements IApi {
    public async call() {
        return '0.0.1';
    }
}