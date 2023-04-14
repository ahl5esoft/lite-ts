import { IUnitOfWork, UserActivityServiceBase, UserServiceBase } from '../../contract';
import { contract } from '../../model';

export class UserConditionActivityService<T extends contract.IConditionActivity> extends UserActivityServiceBase {
    public closeOn: number;
    public hideOn: number;
    public openOn: number;

    public constructor(
        public activity: T,
        userService: UserServiceBase,
    ) {
        super(userService);
    }

    protected async initTime(uow: IUnitOfWork) {
        this.closeOn = 0;
        this.hideOn = 0;
        this.openOn = 0;

        let ok = await this.userService.valueService.checkConditions(uow, this.activity.openConditions);
        if (!ok)
            return;

        ok = await this.userService.valueService.checkConditions(uow, this.activity.closeConditions);
        if (ok)
            return;

        const beginOn = await this.userService.valueService.getCount(uow, this.activity.contrastValueType);
        this.closeOn = Number(beginOn) + Number(this.activity.closeConditions[0][0].count);
        this.hideOn = Number(beginOn) + Number(this.activity.hideConditions[0][0].count);
        this.openOn = Number(beginOn) + Number(this.activity.openConditions[0][0].count);
    }
}