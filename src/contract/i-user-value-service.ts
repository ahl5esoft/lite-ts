import { ITargetValueService } from './i-target-value-service';
import { IUnitOfWork } from './i-unit-of-work';
import { UserServiceBase } from './user-service-base';
import { global } from '../model';

export interface IUserValueService extends ITargetValueService<global.UserValue> {
    readonly userService: UserServiceBase;
    getNow(uow: IUnitOfWork): Promise<number>;
}