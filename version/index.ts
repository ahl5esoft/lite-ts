import { OSFile, tool } from '../src';

(async (): Promise<void> => {
    const readmeFile = new OSFile(__dirname, '..', 'README.md');
    const packageLockJSONFile = new OSFile(__dirname, '..', 'package-lock.json');
    const packageJSONFile = new OSFile(__dirname, '..', 'package.json');
    new tool.version.CheckHandler(process.argv[2]).setNext(
        new tool.version.ReadmeHandler(readmeFile, process.argv[2])
    ).setNext(
        new tool.version.JsonFileHandler(packageLockJSONFile, process.argv[2])
    ).setNext(
        new tool.version.JsonFileHandler(packageJSONFile, process.argv[2])
    ).handle();
})();