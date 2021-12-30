import { ICommand } from './i-command';

/**
 * 命令工厂
 */
export abstract class CommandFactoryBase {
    /**
     * 创建命令
     * 
     * @param type 命令类型
     * @param cmdArgs 命令
     * 
     * @example
     * ```typescript
     *  const cmdFactory: CommandFactoryBase;
     * 
     *  // 获取node版本命令
     *  const cmd = cmdFactory.build(命令类型, ['node', '-v']);
     * ```
     */
    public abstract build(type: number, ...cmdArgs: string[][]): ICommand;
}