import { IAPI } from '../../contract';

export type APIOption = (api: IAPI, req: any) => Promise<void>;