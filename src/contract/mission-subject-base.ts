import { ITargetValueService, IUnitOfWork } from '.';

export abstract class MissionSubjectBase {
    public abstract notify(uow: IUnitOfWork, valueService: ITargetValueService, valueType: number): Promise<void>;
}