import { PushLogBase } from './log-base';

/**
 * 推送markdown日志
 */
export class PushMarkdownLog extends PushLogBase {
    /**
     * 转换成markdown消息
     * 
     * @param labels 标签
     */
    protected convertToPushMessage(labels: [string, any][]) {
        return labels.map(r => {
            if (r[1] instanceof Error)
                return `> ${r[1].message}\n> ${r[1].stack}`;

            return `- ${r[0]}: ${r[1]}`;
        }).join('\n');
    }
}