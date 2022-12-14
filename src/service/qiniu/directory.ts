import { QiniuFileEntryBase } from './file-entry-base';
import { IDirectory } from '../../contract';

export class QiniuDirectory extends QiniuFileEntryBase implements IDirectory {
    public async create() { }

    public async exists() {
        // 七牛不支持目录判断
        return true;
    }

    public async findDirectories() {
        throw QiniuFileEntryBase.errNotImplemented;
        return null;
    }

    public async findFiles() {
        throw QiniuFileEntryBase.errNotImplemented;
        return null;
    }

    public async read() {
        throw QiniuFileEntryBase.errNotImplemented;
        return null;
    }

    public async remove() { }
}