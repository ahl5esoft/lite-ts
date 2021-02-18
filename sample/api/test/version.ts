import { Service } from 'typedi';

import { IAPI } from '../../../src/api';

@Service()
export default class VersionAPI implements IAPI {
    public async call(): Promise<string> {
        return '1.0.0';
    }
}