import 'reflect-metadata';

import * as commander from 'commander';

import { change } from './main/version';

(async () => {
    const cmd = new commander.Command().option(
        '--newVersion <版本号>',
        '新版本号'
    ).parse(process.argv, {
        from: 'user'
    });
    await change(cmd.newVersion);
})();