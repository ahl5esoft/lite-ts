import { ITargetValueService } from './i-target-value-service';
import { IUnitOfWork } from './i-unit-of-work';
import { IValueData } from './i-value-data';

export interface IValueInterceptorService {
    after(uow: IUnitOfWork, valueService: ITargetValueService, valueData: IValueData): Promise<void>;
    before(uow: IUnitOfWork, valueService: ITargetValueService, valueData: IValueData): Promise<boolean>;
}