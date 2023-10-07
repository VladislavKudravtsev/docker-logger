import { FileStorage } from './storage/fs-storage.ts';
import { ContainerLoggerService } from './logger.service.ts';

const loggerService = new ContainerLoggerService(new FileStorage('logs.log'));

loggerService.start();