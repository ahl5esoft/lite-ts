import { Express } from 'express';

export type ExpressOption = (app: Express) => void;