import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';
import { writable } from 'svelte/store';
import { EncryptionUtils } from '../utils/encryption-utils';

// Database
const gunDb = GUN({ peers: ['https://eu1.relay.retroo.app/gun', 'https://services.idevop.ch:8765/gun'] });

// Gun User
const gunUser = gunDb.user().recall({ sessionStorage: true });

// Current User's username
export const username = writable('');

export class Database {

  private userKey: any;
  public get user() { return gunUser; }
  public get db() { return gunDb; }

  constructor() {
    const storedUserKey = sessionStorage.getItem('pair');
    if (storedUserKey) {
      this.userKey = JSON.parse(storedUserKey);
    }
  }

  public async loginUser(username: string, password: string) {

    this.user.auth(username, password, (ack: any) => {
      if (ack.err) {
        alert(ack.err);
        return;
      }
      this.userKey = ack.sea;
    });
  }

  public async signup(username: string, password: string) {
    this.user.create(username, password, (ack: any) => {
      if (ack.err) {
        alert(ack.err);
      } else {
        this.loginUser(username, password);
      }
    });
  }


  public async putSecure<TDataType>(path: string, data: TDataType, pair: any, sign = true) {
    if (!path || !pair || !data) {
      throw new Error('Cannot encrypt and put data.');
    }

    const encryptedData = sign ? await EncryptionUtils.encryptAndSign(data, pair) : await EncryptionUtils.encrypt(data, pair);
    this.put(path, encryptedData);
  }


  public async putUser<TDataType>(path: string, data: TDataType) {
    if (!this.user || !path || !this.userKey || !data) {
      throw new Error('Cannot encrypt and put user data.');
    }
    const encryptedData = await EncryptionUtils.encryptAndSign(data, this.userKey);
    this.put(path, encryptedData, this.user);
  }

  public async put<TDataType>(path: string, data: TDataType, database?: any) {
    if (!path || !data) {
      throw new Error('Cannot put data.');
    }

    if (!database) {
      database = this.db;
    }

    return new Promise((resolve, reject) => {

      const currentDb = this.splitPathIntoGets(path, database);
      currentDb.put(data as any, ack => {
        if (ack?.err) {
          reject(ack.err);
          return;
        }
        resolve(ack);
      });
    });
  }


  public async setSecure<TDataType>(path: string, data: TDataType, pair: any, sign = true) {
    if (!this.user || !path || !this.userKey || !data) {
      throw new Error('Cannot encrypt and set data.');
    }

    const encryptedData = sign ? await EncryptionUtils.encryptAndSign(data, pair) : await EncryptionUtils.encrypt(data, pair);
    this.set(path, encryptedData);
  }


  public async setUser<TDataType>(path: string, data: TDataType) {
    if (!this.user || !path || !this.userKey || !data) {
      throw new Error('Cannot encrypt and set user data.');
    }
    const encryptedData = await EncryptionUtils.encryptAndSign(data, this.userKey);
    this.set(path, encryptedData, this.user);
  }

  public async set<TDataType>(path: string, data: TDataType, database?: any) {
    if (!path || !data) {
      throw new Error('Cannot set data.');
    }

    if (!database) {
      database = this.db;
    }

    return new Promise((resolve, reject) => {

      const currentDb = this.splitPathIntoGets(path, database);
      currentDb.set(data as any, ack => {
        if (ack?.err) {
          reject(ack.err);
          return;
        }
        resolve(ack);
      });
    });
  }

  public async onceSecure(path: string, pair: any, sign = true): Promise<unknown> {
    if (!path || !pair) {
      throw new Error('Cannot get encrypted data.');
    }

    const encryptionFunctionSigned = (encryptedValue) => EncryptionUtils.decryptAndVerify(encryptedValue, pair);
    const encryptionFunction = (encryptedValue) => EncryptionUtils.decrypt(encryptedValue, pair);

    return await this.once(path, sign ? encryptionFunctionSigned : encryptionFunction);
  }

  public async onceUser(path: string): Promise<unknown> {
    if (!this.user || !path || !this.userKey) {
      throw new Error('Cannot get encrypted user data.');
    }
    return await this.once(path,
      (encryptedValue) => EncryptionUtils.decryptAndVerify(encryptedValue, this.userKey),
      this.user);
  }

  public async once(path: string, decryptionFunc?: (encryptedData: any) => Promise<any>, database?: any, timeout = 5000): Promise<unknown> {
    if (!path) {
      throw new Error('Cannot get data.');
    }
    return await new Promise(async (resolve, reject) => {

      if (!database) {
        database = this.db;
      }

      let dataHasBeenFetched = false;
      this.splitPathIntoGets(path, database).on(cb => {
        if (cb !== undefined && cb != null) {
          dataHasBeenFetched = true;
          this.splitPathIntoGets(path, database).off();
          if (decryptionFunc) {
            resolve(decryptionFunc(cb));
            return;
          }

          resolve(cb);
        }
      });

      setTimeout(() => {
        if (!dataHasBeenFetched) {
          this.splitPathIntoGets(path, database).off();
          reject('Timeout, could not find data.');
        }
      }, timeout)
    });
    /*
        return new Promise((resolve, reject) => {
    
          if (!database) {
            database = this.db;
          }
    
          const currentDb = this.splitPathIntoGets(path, database);
    
          
          currentDb.once(async gunCb => {
    
            if (!gunCb) {
              return;
            }
    
            if (gunCb?.err) {
              reject(gunCb.err);
              return;
            }
    
            let returnData = gunCb;
    
            if (decryptionFunc !== undefined) {
              returnData = await decryptionFunc(gunCb as any);
            }
    
            resolve(returnData);
          });
        });*/
  }

  public onSecure(path: string, pair: any, callback: (data: unknown) => void, sign = true): void {
    if (!path || !callback || !pair) {
      throw new Error('Cannot get encrypted data.');
    }

    const encryptionFunctionSigned = (encryptedValue) => EncryptionUtils.decryptAndVerify(encryptedValue, pair);
    const encryptionFunction = (encryptedValue) => EncryptionUtils.decrypt(encryptedValue, pair);

    this.on(path, (cb) => callback(cb), sign ? encryptionFunctionSigned : encryptionFunction);
  }

  public onUser(path: string, callback: (data: unknown) => void): void {
    if (!path || !callback || !this.userKey || !this.user) {
      throw new Error('Cannot get encrypted user data.');
    }

    this.on(path, (cb) => callback(cb),
      (encryptedValue) => EncryptionUtils.decryptAndVerify(encryptedValue, this.userKey),
      this.user);
  }

  public on(path: string, callback: (data: unknown) => void, decryptionFunc?: (encryptedData: any) => Promise<any>, database?: any): void {
    if (!path || !callback) {
      throw new Error('Cannot get data.');
    }

    if (!database) {
      database = this.db;
    }

    const currentDb = this.splitPathIntoGets(path, database);
    currentDb.on(async gunCb => {
      if (gunCb?.err) {
        callback(gunCb.err);
        return;
      }

      let returnData = gunCb;

      if (decryptionFunc !== undefined) {
        returnData = await decryptionFunc(gunCb as any);
      }

      callback(returnData);
    });
  }

  private splitPathIntoGets(path: string, database: any) {
    const paths = path.split('.');
    let currentDb = database;
    for (const pathItem of paths) {
      currentDb = currentDb.get(pathItem)
    }
    return currentDb;
  }
}





/*
stuff();
async function stuff() {
db.on('auth' as any, async (event: any) => {
    const alias = await user.get('alias'); // username string
    username.set(alias as any);

    console.log(`signed in as ${alias}`);
});
}*/