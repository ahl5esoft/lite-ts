import { createReadStream, createWriteStream, existsSync, readFile, unlink, writeFile } from 'fs';
import { dirname } from 'path';
import { promisify } from 'util';

import { OSDirectory } from './directory';
import { FileBase } from '../../contract';

const readFileFunc = promisify(readFile);
const unlinkAction = promisify(unlink);
const writeFileAction = promisify(writeFile);

export class OSFile extends FileBase {
    public async exists(): Promise<boolean> {
        return existsSync(this.path);
    }

    public async move(dstFilePath: string): Promise<void> {
        let isExist = await this.exists();
        if (!isExist)
            return;

        isExist = await new OSFile(dstFilePath).exists();
        if (isExist)
            throw new Error(`文件已经存在: ${dstFilePath}`);

        await new OSDirectory(dirname(dstFilePath)).create();

        await new Promise((s, f) => {
            createReadStream(this.path)
                .on('err', f)
                .on('end', s)
                .pipe(createWriteStream(dstFilePath));
        });
        await this.remove();
    }

    public async readJSON<T>(): Promise<T> {
        const content = await this.readString();
        return JSON.parse(content);
    }

    public async readString(): Promise<string> {
        return await readFileFunc(this.path, 'utf8');
    }

    public async remove(): Promise<void> {
        const isExist = await this.exists();
        if (isExist)
            await unlinkAction(this.path);
    }

    public async write(content: any): Promise<void> {
        if (typeof content != 'string')
            content = JSON.stringify(content, null, '\t');
        await writeFileAction(this.path, content);
    }
}
