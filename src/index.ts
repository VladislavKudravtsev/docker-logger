import inquirer from 'inquirer';

import { FileStorage } from './storage/fs-storage.ts';
import { ContainerLoggerService } from './logger.service.ts';
import Docker from 'dockerode';

async function start() {
  const docker = new Docker();
  const containers = await docker.listContainers();

  if (containers.length === 0) {
    console.log('There is no containers to listen');
    return;
  }

  const cliOptions = [
    {
      type: 'input',
      name: 'filepath',
      message: 'Please enter a file path for logs'
    },
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

  const { container: containerInfo, storeOldLogs, filepath } = answers;
  const [name] = containerInfo.Names;


  const fileStorage = new FileStorage(filepath);
  const loggerService = new ContainerLoggerService(fileStorage, { storeOldLogs });

  const container = docker.getContainer(containerInfo.Id);

  console.log(`Listening ${name}`);
  loggerService.collectLogs(container);
}

start()