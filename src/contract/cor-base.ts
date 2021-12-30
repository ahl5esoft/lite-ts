type NextType = CORBase | (() => CORBase);

/**
 * 责任链基类
 */
export abstract class CORBase {
    /**
     * 处理器列表
     */
    private m_Nexts: NextType[] = [];

    /**
     * 是否停止调用下一个处理器
     */
    public break = false;

    /**
     * 处理
     */
    public async handle(): Promise<void> {
        if (this.break)
            return;

        for (const r of this.m_Nexts) {
            let handler = r instanceof CORBase ? r : r();
            await handler.handle();
            if (handler.break)
                break;
        }
    }

    /**
     * 设置下一个处理器
     * 
     * @param next 处理器对象或创建处理器函数
     * @returns CORBase
     */
    public setNext(next: NextType): this {
        this.m_Nexts.push(next);
        return this;
    }
}