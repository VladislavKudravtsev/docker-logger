import { exec, spawn } from 'node:child_process';
import { promisify } from 'node:util'
import inquirer from 'inquirer';
import { FileStorage } from './storage/fs-storage.ts';

const execPromise = promisify(exec);

const containers: string[] = [];

const { stdout } = await execPromise('docker container ls --format="{{.Names}}"');

containers.push(...stdout.trimEnd().split('\n'));

const cliOptions = {
  type: 'list',
  name: 'container',
  message: 'Select container to listen',
  choices: containers
}

const answers = await inquirer.prompt([cliOptions]);
const { container } = answers; 


const logs = spawn('docker', ['logs', container, '--follow'])
console.log(`Listen ${container} logs`);

const storage = new FileStorage(`${container}.log`);

logs.stdout.on('data', async (data: any) => {
  console.log(data.toString().trimEnd())
  await storage.save(data.toString());
})

logs.stderr.on('data', (data: any) => {
  console.error(data.toString());
});

logs.on('exit', (code: any) => {
  console.log(`Child exited with code ${code}`);
}); 
