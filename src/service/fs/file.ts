import { createReadStream, createWriteStream, existsSync, readFile, unlink, writeFile } from 'fs';
import { dirname } from 'path';
import { promisify } from 'util';

import { FSDirectory } from './directory';
import { IOFileBase } from '../../contract';

const readFileFunc = promisify(readFile);
const unlinkAction = promisify(unlink);
const writeFileAction = promisify(writeFile);

export class FSFile extends IOFileBase {
    public async exists() {
        return existsSync(this.path);
    }

    public async move(dstFilePath: string) {
        let isExist = await this.exists();
        if (!isExist)
            return;

        isExist = await new FSFile(dstFilePath).exists();
        if (isExist)
            throw new Error(`文件已经存在: ${dstFilePath}`);

        await new FSDirectory(
            dirname(dstFilePath)
        ).create();

        await new Promise((s, f) => {
            createReadStream(this.path).on('err', f).on('end', s).pipe(
                createWriteStream(dstFilePath)
            );
        });
        await this.remove();
    }

    public async readJSON() {
        const content = await this.readString();
        return JSON.parse(content);
    }

    public async readString() {
        return await readFileFunc(this.path, 'utf8');
    }

    public async remove() {
        const isExist = await this.exists();
        if (isExist)
            await unlinkAction(this.path);
    }

    public async write(content: any) {
        if (typeof content != 'string')
            content = JSON.stringify(content, null, '\t');
        await writeFileAction(this.path, content);
    }
}
