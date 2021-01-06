import { OtherHandler } from './other-handler';
import { ReadmeHandler } from './readme-handler';
import { Directory } from '../../io/os';

export async function change(version: string): Promise<void> {
    await new ReadmeHandler().setNext(
        new OtherHandler('package.json')
    ).setNext(
        new OtherHandler('package-lock.json')
    ).handle({
        rootDir: new Directory(__dirname, '..', '..', '..'),
        version: version
    });
}