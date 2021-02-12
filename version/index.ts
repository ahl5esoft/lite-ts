import { CheckHandler } from './check-handler';
import { ReadmeHandler } from './readme-handler';
import { OSDirectory, OSFactory } from '../src/os';
import { JsonFileHandler } from './json-file-handler';

(async (): Promise<void> => {
    const ioFactory = new OSFactory();
    const dir = new OSDirectory(__dirname, '..');
    new CheckHandler(process.argv[2]).setNext(
        new ReadmeHandler(ioFactory, dir, process.argv[2])
    ).setNext(
        new JsonFileHandler(ioFactory, dir, 'package-lock.json', process.argv[2])
    ).setNext(
        new JsonFileHandler(ioFactory, dir, 'package.json', process.argv[2])
    ).handle();
})();