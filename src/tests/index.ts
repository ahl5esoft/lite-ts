import { exec } from 'child_process';
import { Command } from 'commander';
import { join } from 'path';
import { promisify } from 'util';
import { File } from '../io/os';

const execAction = promisify(exec);

(async () => {
    const cmd = new Command().option('--file <文件路径>', '测试的文件').option('--time <时间>', '测试用例超时时间, 默认10s').parse(process.argv, {
        from: 'user'
    });
    if (!cmd.file) {
        return console.log(
            cmd.helpInformation()
        );
    }

    if (!cmd.time)
        cmd.time = '10s';

    const file = new File(cmd.file);
    const isExist = await file.isExist();
    if (!isExist)
        throw new Error(`无效测试文件: ${cmd.file}`);

    await execAction(`mocha -t ${cmd.time} -r ./node_modules/ts-node/register ${cmd.file}`, {
        cwd: join(__dirname, '..', '..')
    });
})().catch(ex => {
    console.log(ex.stdout || ex.message);
});