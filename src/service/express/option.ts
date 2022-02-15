import { Express } from 'express';

/**
 * Experss选项
 */
export type ExpressOption = (app: Express) => void;