import { Storage } from "./storage.interface";
import { appendFile } from 'node:fs/promises'

export class FileStorage implements Storage {
  private readonly source: string;

  constructor(source: string) {
      this.source = source;    
  }

  public async save(data: string): Promise<void> {
    return appendFile(this.source, data)
    .catch(err => {
      console.log(err);
    })
  }
}
