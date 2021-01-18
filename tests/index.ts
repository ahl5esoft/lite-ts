import { exec } from 'child_process';
import { Command } from 'commander';
import { join } from 'path';
import { promisify } from 'util';

import { OSDirectory, OSFile } from '../io/os';

const execAction = promisify(exec);
const suffixs = ['_env-test.ts', '_test.ts'];

async function testDir(dirPath: string, time: string) {
    const dir = new OSDirectory(dirPath);
    const files = await dir.findFiles();
    for (const r of files) {
        await testFile(r.path, time);
    }

    const childDirs = await dir.findDirectories();
    for (const r of childDirs) {
        await testDir(r.path, time);
    }
}

async function testFile(filePath: string, time: string): Promise<void> {
    const file = new OSFile(filePath);
    const isExist = await file.isExist();
    if (!isExist)
        throw new Error(`无效测试文件: ${filePath}`);

    const ok = suffixs.some((r): boolean => {
        return file.name.endsWith(r);
    })
    if (!ok)
        return;

    const cmd = `mocha -t ${time} -r ./node_modules/ts-node/register ${filePath}`;
    console.log(cmd);
    await execAction(cmd, {
        cwd: join(__dirname, '..'),
        timeout: 1000 * 30
    });
}

(async () => {
    const cmd = new Command().option('--dir <目录路径>', '递归测试所有测试文件').option('--file <文件路径>', '测试的文件').option(
        '--time <时间>',
        '测试用例超时时间, 默认10s'
    ).parse(process.argv, {
        from: 'user'
    });
    if (!cmd.time)
        cmd.time = '10s';

    if (cmd.file) {
        await testFile(cmd.file, cmd.time);
    } else if (cmd.dir) {
        await testDir(cmd.dir, cmd.time);
    } else {
        console.log(
            cmd.helpInformation()
        );
    }
})().catch(ex => {
    console.log(ex.stdout || ex.message);
});