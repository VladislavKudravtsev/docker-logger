import stream from 'node:stream';
import { Container } from 'dockerode';

import { Storage } from './storage/storage.interface.ts';


type LoggerOptions = {
  storeOldLogs?: boolean
}

export class ContainerLoggerService {
  private readonly storage: Storage
  private readonly options: LoggerOptions

  constructor(storage: Storage, options: LoggerOptions) {
    this.storage = storage;
    this.options = options;
  }
  
  public collectLogs(container: Container) {
    const logStream = new stream.PassThrough();

    logStream.on('data', async (chunk) => {
      const data = chunk.toString('utf8');

      // save data to storage
      await this.storage.save(data);
      console.log(data.trimEnd());
    });

    container.logs({
      follow: true,
      stdout: true,
      stderr: true,
      tail: this.options.storeOldLogs ? undefined : 0 // if true take all logs
    }, (err, stream) => {
      if(err) {
        console.log(err.message);
      }

      // attach stream to container logs
      container.modem.demuxStream(stream, logStream, logStream);
    });
  }
}