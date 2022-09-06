import { Inject, Service } from 'typedi';

import { IApi, NowTimeBase } from '../../../../src';

@Service()
export default class NowTimeApi implements IApi {
    @Inject()
    public nowTime: NowTimeBase;

    public async call() {
        return this.nowTime.unix();
    }
}