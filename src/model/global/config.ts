/**
 * 配置模型
 */
export class Config {
    /**
     * 标识, 配置名
     */
    public id: string;

    /**
     * 配置项
     */
    public items: { [key: string]: any };
}