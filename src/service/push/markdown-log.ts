import { PushLogBase } from './log-base';

export class PushMarkdownLog extends PushLogBase {
    protected convertToPushMessage(labels: [string, any][]) {
        return labels.map(r => {
            if (r[1] instanceof Error)
                return `> ${r[1].message}\n> ${r[1].stack}`;

            return `- ${r[0]}: ${r[1]}`;
        }).join('\n');
    }
}