import { IAPI } from './i-api';

export type APIOption = (api: IAPI, req: any) => Promise<void>;