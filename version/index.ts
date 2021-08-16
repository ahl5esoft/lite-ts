import { service, version } from '../src';

(async (): Promise<void> => {
    const readmeFile = new service.FSFile(__dirname, '..', 'README.md');
    const packageLockJSONFile = new service.FSFile(__dirname, '..', 'package-lock.json');
    const packageJSONFile = new service.FSFile(__dirname, '..', 'package.json');
    new version.CheckHandler(process.argv[2]).setNext(
        new version.ReadmeHandler(readmeFile, process.argv[2])
    ).setNext(
        new version.JsonFileHandler(packageLockJSONFile, process.argv[2])
    ).setNext(
        new version.JsonFileHandler(packageJSONFile, process.argv[2])
    ).handle();
})();