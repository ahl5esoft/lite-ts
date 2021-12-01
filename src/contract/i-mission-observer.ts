import { ITargetValueService, IUnitOfWork } from '.';

export interface IMissionObserver {
    update(uow: IUnitOfWork, valueService: ITargetValueService, valueType: number): Promise<void>;
}