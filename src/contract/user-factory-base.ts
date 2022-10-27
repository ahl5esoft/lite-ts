import { UserServiceBase } from './user-service-base';

export abstract class UserFactoryBase<T extends UserServiceBase>{
    public abstract build(userID: string): T;
}