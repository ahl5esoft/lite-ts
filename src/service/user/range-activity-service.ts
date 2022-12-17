import { UserActivityServiceBase, UserServiceBase } from '../../contract';
import { contract } from '../../model';

export class UserRangeActivityService<T extends contract.IRangeActivity> extends UserActivityServiceBase {
    public get closeOn() {
        return this.activity.closeOn;
    }

    public get hideOn() {
        return this.activity.hideOn;
    }

    public get openOn() {
        return this.activity.openOn;
    }

    public constructor(
        public activity: T,
        userService: UserServiceBase,
    ) {
        super(userService);
    }
}