import { IUnitOfWork } from './i-unit-of-work';
import { UserServiceBase } from './user-service-base';

export abstract class UserActivityServiceBase {
    private m_RemainTime: [number, number];

    public abstract get closeOn(): number;
    public abstract get hideOn(): number;
    public abstract get openOn(): number;

    public constructor(
        protected userService: UserServiceBase,
    ) { }

    public async getRemainTime(uow: IUnitOfWork) {
        if (!this.m_RemainTime) {
            await this.initTime(uow);

            const now = await this.userService.valueService.now;
            this.m_RemainTime = this.openOn > now ? [0, 0] : [
                this.hideOn - now < 0 ? 0 : this.hideOn - now,
                this.closeOn - now < 0 ? 0 : this.closeOn - now
            ];
        }

        return this.m_RemainTime;
    }

    protected async initTime(_: IUnitOfWork) { }
}