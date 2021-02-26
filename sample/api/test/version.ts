import { Service } from 'typedi';

import { APIBase } from '../../../src';

@Service()
export default class VersionAPI extends APIBase {
    public async call() {
        return '1.0.0';
    }
}