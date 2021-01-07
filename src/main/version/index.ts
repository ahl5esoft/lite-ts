import 'reflect-metadata';

import * as commander from 'commander';

import { OtherHandler } from './other-handler';
import { ReadmeHandler } from './readme-handler';
import { Directory } from '../../io/os';

(async (): Promise<void> => {
    const cmd = new commander.Command().option(
        '--nv <版本号>',
        '新版本号'
    ).parse(process.argv, {
        from: 'user'
    });
    if (!cmd.nv) {
        return console.log(
            cmd.helpInformation()
        );
    }
    await new ReadmeHandler().setNext(
        new OtherHandler('package.json')
    ).setNext(
        new OtherHandler('package-lock.json')
    ).handle({
        rootDir: new Directory(__dirname, '..', '..', '..'),
        version: cmd.nv
    });
})();