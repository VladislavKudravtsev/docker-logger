import { FileStorage } from './storage/fs-storage.ts';
import { ContainerLoggerService } from './logger.service.ts';

const fileStorage = new FileStorage('logs.log');

const loggerService = new ContainerLoggerService(fileStorage);

loggerService.start();