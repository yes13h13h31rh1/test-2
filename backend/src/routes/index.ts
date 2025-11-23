import { Express } from 'express';
import { scriptRoutes } from './scripts';
import { assetRoutes } from './assets';
import { userRoutes } from './users';

export function setupRoutes(app: Express) {
  app.use('/api/scripts', scriptRoutes);
  app.use('/api/assets', assetRoutes);
  app.use('/api/users', userRoutes);
}
