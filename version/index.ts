import { service, version } from '../src';

(async (): Promise<void> => {
    const fileFactory = new service.FsFileFactory();
    const readmeFile = fileFactory.buildFile(__dirname, '..', 'README.md');
    const packageLockJSONFile = fileFactory.buildFile(__dirname, '..', 'package-lock.json');
    const packageJSONFile = fileFactory.buildFile(__dirname, '..', 'package.json');
    new version.CheckHandler(process.argv[2]).setNext(
        new version.ReadmeHandler(readmeFile, process.argv[2])
    ).setNext(
        new version.JsonFileHandler(packageLockJSONFile, process.argv[2])
    ).setNext(
        new version.JsonFileHandler(packageJSONFile, process.argv[2])
    ).handle();
})();