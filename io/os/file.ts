import { createReadStream, createWriteStream, existsSync } from 'fs';
import { readFile, unlink, writeFile } from 'fs/promises';
import { dirname } from 'path';

import { OSDirectory } from './directory';
import { FileBase } from '../file-base';

export class OSFile extends FileBase {
    public async isExist(): Promise<boolean> {
        return existsSync(this.path);
    }

    public async move(dstFilePath: string): Promise<void> {
        let isExist = await this.isExist();
        if (!isExist)
            return;

        isExist = await new OSFile(dstFilePath).isExist();
        if (isExist)
            throw new Error(`文件已经存在: ${dstFilePath}`);

        await new OSDirectory(
            dirname(dstFilePath)
        ).create();

        await new Promise((s, f) => {
            createReadStream(this.path).on('err', f).on('end', s).pipe(
                createWriteStream(dstFilePath)
            );
        });
        await this.remove();
    }

    public async readJSON<T>(): Promise<T> {
        const content = await this.readString();
        return JSON.parse(content);
    }

    public async readString(): Promise<string> {
        return await readFile(this.path, 'utf8');
    }

    public async remove(): Promise<void> {
        const isExist = await this.isExist();
        if (isExist)
            await unlink(this.path);
    }

    public async write(content: any): Promise<void> {
        if (typeof content != 'string')
            content = JSON.stringify(content);

        await writeFile(this.path, content);
    }
}
