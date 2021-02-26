import { CheckHandler } from './version/check-handler';
import { JsonFileHandler } from './version/json-file-handler';
import { ReadmeHandler } from './version/readme-handler';

export const tool = {
    version: {
        CheckHandler,
        JsonFileHandler,
        ReadmeHandler
    }
};