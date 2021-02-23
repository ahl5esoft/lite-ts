import { CheckHandler } from './check-handler';
import { JsonFileHandler } from './json-file-handler';
import { ReadmeHandler } from './readme-handler';
import { OSFile } from '../src/os';

(async (): Promise<void> => {
    const readmeFile = new OSFile(__dirname, '..', 'README.md');
    const packageLockJSONFile = new OSFile(__dirname, '..', 'package-lock.json');
    const packageJSONFile = new OSFile(__dirname, '..', 'package.json');
    new CheckHandler(process.argv[2]).setNext(
        new ReadmeHandler(readmeFile, process.argv[2])
    ).setNext(
        new JsonFileHandler(packageLockJSONFile, process.argv[2])
    ).setNext(
        new JsonFileHandler(packageJSONFile, process.argv[2])
    ).handle();
})();