import { IEnumItemData } from './i-enum-item-data';

/**
 * 数值类型枚举结构
 */
export interface IValueTypeData extends IEnumItemData {
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
    dailyTime?: number;

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
    isReplace?: boolean;
}