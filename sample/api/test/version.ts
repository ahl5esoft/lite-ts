import { Inject, Service } from 'typedi';

import { APIBase, APICallerBase, StringGeneratorBase } from '../../../src';

@Service()
export default class VersionAPI extends APIBase {
    @Inject()
    public apiCaller: APICallerBase;

    @Inject()
    public stringGenerator: StringGeneratorBase;

    protected async call() {
        return '1.0.0';
    }
}