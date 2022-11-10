import { unitOfTime } from 'moment';

import { IEnumItem, IReward } from '../contract';

/**
 * 数值枚举模型
 */
export class ValueTypeData implements IEnumItem {
    /**
     * 键
     */
    public key: string;
    /**
     * 文本
     */
    public text: string;
    /**
     * 枚举值
     */
    public value: number;
    /**
     * 每日数值类型, 值有效的情况下, 目标数值更新时会根据该值对应的目标数值是否与当前时间同一日,如果不同日则目标数值会重置为0
     * 
     * @example
     * ```typescript
     *  const valueTypeDatas: IValueTypeData[] = [{
     *      value: 1,
     *      text: '今日登录次数',
     *      dailyTime: 2
     *  }, {
     *      value: 2,
     *      text: '今日登录次数更新时间',
     *  }];
     * 
     *  const valueService: ITargetValueService;
     *  valueService.data = {
     *      id: '目标ID',
     *      values: [{
     *          1: 5,
     *          2: 上次更新登录次数的时间戳
     *      }]
     *  };
     * 
     *  await valueService.update(工作单元, [{
     *      count: 1,
     *      valueType: 1
     *  }]);
     *  const res = await valueService.getCount(工作单元, 1);
     *  // res = 当上次更新登录次数的时间戳与今天时同一天则为6 如果不同天则为1
     * ```
     */
    public dailyTime?: number;
    /**
     * 数值类型更新之后的值可为负数
     * 
     * @example
     * ```typescript
     *  const valueTypeDatas: IValueTypeData[] = [{
     *      isNegative: true, // 如果该值未false, 更新后为负数则会报错: new CustomError(ErrorCode.valueTypeNotEnough, { valueType: 1, count: 10, consume: -100 })
     *      text: '相对横坐标',
     *      value: 1,
     *  }];
     * 
     *  const valueService: ITargetValueService;
     *  valueService.data = {
     *      id: '目标ID',
     *      values: [{
     *          1: 10
     *      }]
     *  };
     * 
     *  wait valueService.update(工作单元, [{
     *      count: -100,
     *      valueType: 1
     *  ]);
     */
    public isNegative?: boolean;
    /**
     * 数值类型每次更新时都是替换, 默认为累积
     * 
     * @example
     * ```typescript
     *  const valueTypeDatas: IValueTypeData[] = [{
     *      value: 1,
     *      text: '登录时间',
     *      isReplace: true
     *  }];
     * 
     *  const valueService: ITargetValueService;
     *  valueService.data = {
     *      id: '目标ID',
     *      values: [{
     *          1: 1,
     *          2: 11
     *      }]
     *  };
     * 
     *  await valueService.update(工作单元, [{
     *      count: 1,
     *      valueType: 22
     *  }]);
     *  const res = await valueService.getCount(工作单元, 1);
     *  // res = 22
     */
    public isReplace?: boolean;
    /**
     * 开启奖励
     */
    public openRewards?: IReward[][];
    /**
     * 奖励附加
     */
    public rewardAddition?: {
        /**
         * 奖励数值类型
         */
        rewardValueType: number;
        /**
         * 数值类型
         */
        valueType: number;
    };
    /**
     * 重置数值类型, 值有效的情况下, 目标数值更新时会根据该值对应的目标数值是否与当前时间同一时间周期（momentType）,如果不同日则目标数值会重置为0
     * 
     * @example
     * ```typescript
     * conts valueTypes: IValueTypeData[] = [{
     *     value: 1,
     *     text: '周活跃度',
     *     time: {
     *         valueType: 2
     *     }
     * }, {
     *     value: 2,
     *     text: '周活跃度更新时间',
     *     time: {
     *         momentType: 'isoWeek'
     *     }
     * }];
     * 
     * const valueService: ITargetValueService;
     * valueService.data = {
     *      id: '目标ID',
     *      values: [{
     *          1: 50,
     *          2: 周活跃度更新时间的时间戳
     *      }]
     *  };
     * 
     *  await valueService.update(工作单元, [{
     *      count: 1,
     *      valueType: 1
     *  }]);
     *  const res = await valueService.getCount(工作单元, 1);
     *  // res = 当上次更新登录次数的时间戳与本周是同一周则为6 如果不同周则为1
     * ```
     */
    public time?: {
        /**
         * 数值类型
         */
        valueType?: number;
        /**
         * 时间类型
         */
        momentType?: unitOfTime.StartOf;
    };
}