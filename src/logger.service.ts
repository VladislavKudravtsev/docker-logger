import stream from 'node:stream';
import inquirer from 'inquirer';
import Docker, { Container } from 'dockerode';

import { Storage } from './storage/storage.interface.ts';

export class ContainerLoggerService {
    private readonly docker: Docker
    private readonly storage: Storage

    constructor(storage: Storage) {
      this.docker = new Docker();
      this.storage = storage;
    }
    
    private collectLogs(container: Container, storeOldLogs: boolean) {
      const logStream = new stream.PassThrough();
  
      logStream.on('data', async (chunk) => {
        const line = chunk.toString('utf8');
        // save data to storage
        await this.storage.save(line);
        console.log(line.trimEnd());
      });
  
      container.logs({
        follow: true,
        stdout: true,
        stderr: true,
        tail: storeOldLogs ? undefined : 0 // if true take all logs
      }, (err, stream) => {
        if(err) {
          console.log(err.message);
        }
  
        // attach stream to contaier logs
        container.modem.demuxStream(stream, logStream, logStream);
      });
    }
  
    public async start() {
      const containers = await this.docker.listContainers();
  
      const cliOptions = [
        {
          type: 'list',
          name: 'container',
          message: 'Select container to listen',
          choices: [...containers.map((c) => ({ name: c.Names[0], value: c }))],
        }, 
        {
          type: 'confirm',
          name: 'storeOldLogs',
          message: 'Do you want to store old logs?',
        },
      ];
  
      // show cli menu
      const answers = await inquirer.prompt(cliOptions);
  
      const { container: containerInfo, storeOldLogs } = answers;
      const [name] = containerInfo.Names;

      const container = this.docker.getContainer(containerInfo.Id);
  
      console.log(`Listening ${name}`);
      this.collectLogs(container, storeOldLogs);
    }
  }