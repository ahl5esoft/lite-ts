import lite from '../src';

(async (): Promise<void> => {
    const readmeFile = new lite.service.FSFile(__dirname, '..', 'README.md');
    const packageLockJSONFile = new lite.service.FSFile(__dirname, '..', 'package-lock.json');
    const packageJSONFile = new lite.service.FSFile(__dirname, '..', 'package.json');
    new lite.version.CheckHandler(process.argv[2]).setNext(
        new lite.version.ReadmeHandler(readmeFile, process.argv[2])
    ).setNext(
        new lite.version.JsonFileHandler(packageLockJSONFile, process.argv[2])
    ).setNext(
        new lite.version.JsonFileHandler(packageJSONFile, process.argv[2])
    ).handle();
})();