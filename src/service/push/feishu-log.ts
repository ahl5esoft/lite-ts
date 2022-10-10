import { PushLogBase } from './log-base';
import { request } from '../../model';

/**
 * 飞书日志(推送)
 */
export class PushFeishuLog extends PushLogBase {
    protected convertToPushMessage(labels: [string, any][]) {
        return labels.reduce((memo, r) => {
            if (r[1] instanceof Error) {
                memo.push([{
                    tag: 'text',
                    text: ['错误', r[1].message].join(': ')
                }]);
                if (r[1].stack) {
                    memo.push([{
                        tag: 'text',
                        text: ['堆栈', r[1].stack].join(': ')
                    }]);
                }
            } else {
                memo.push([{
                    tag: 'text',
                    text: r.join(': ')
                }]);
            }
            return memo;
        }, [] as request.FeishuPostPush[][]);
    }
}