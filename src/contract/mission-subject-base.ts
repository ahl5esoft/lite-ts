import { ITargetValueService, IUnitOfWork } from '.';

/**
 * 任务主题接口
 */
export abstract class MissionSubjectBase {
    /**
     * 通知任务观察者
     * 
     * @param uow 工作单元
     * @param valueService 数值服务
     * @param valueType 数值类型
     */
    public abstract notify(uow: IUnitOfWork, valueService: ITargetValueService, valueType: number): Promise<void>;
}