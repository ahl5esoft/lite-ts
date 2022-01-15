import { ICommand } from './i-command';

/**
 * 命令工厂
 * 
 * @deprecated CommandBase
 */
export abstract class CommandFactoryBase {
    /**
     * 创建命令
     * 
     * @param type 命令类型
     * @param cmdArgs 命令
     */
    public abstract build(type: number, ...cmdArgs: string[][]): ICommand;
}