import GUN, { SEA } from 'gun';
import 'gun/sea';
import 'gun/axe';
import type { IGunCryptoKeyPair } from 'gun/types/types';

export class EncryptionUtils {

    public static async createKeypair(): Promise<IGunCryptoKeyPair | undefined> {
        return await SEA.pair();
    }
    
    public static async encryptAndSign<TDataType>(data: TDataType, pair: any): Promise<TDataType> {
        return await this.processObjectProps(data, (val) => this.encAndSign(val, pair));
    }
    
    public static async encrypt<TDataType>(data: TDataType, pair: any): Promise<TDataType> {
        return await this.processObjectProps(data, (val) => this.enc(val, pair));
    }
    
    public static async decryptAndVerify<TDataType>(data: TDataType, pair: any): Promise<TDataType> {
        return await this.processObjectProps(data, (val) => this.decrAndVerify(val, pair) as any);
    }
    
    public static async decrypt<TDataType>(data: TDataType, pair: any): Promise<TDataType> {
        return await this.processObjectProps(data, (val) => this.decr(val, pair) as any);
    }
    
    private static async processObjectProps<TDataType>(data: TDataType,
        func: (data: TDataType) => Promise<string | TDataType>): Promise<TDataType> {
    
        if (!data || !func) {
            return undefined;
        }
    
        if (typeof data !== "object") {
            return await func(data) as TDataType;
        }
    
        for (const [key, value] of Object.entries(data)) {
            if (value) {
               // if (typeof value === "object") {
                   // data[key] = await processObjectProps(value, func);
               // } else {
                    data[key] = await func(value);
               // }
            }
        }
        return data;
    }
    
    private static async encAndSign(data: any, pair: any): Promise<string> {
        if (!pair) {
            throw new Error(`Cannot encrypt data, because the pair is not defined.`);
        }
        var encrypted = await this.enc(data, pair);
        return await SEA.sign(encrypted, pair);
    }
    
    private static async enc(data: any, pair: any): Promise<string> {
        if (!pair) {
            throw new Error(`Cannot encrypt data, because user key is not defined.`);
        }
        return await SEA.encrypt(data, pair);
    }
    
    private static async decrAndVerify(data: any, pair: any): Promise<undefined> {
        if (!pair) {
            throw new Error(`Cannot encrypt data, because user key is not defined.`);
        }
        return await this.decr(await SEA.verify(data, pair.pub), pair);
    }
    
    private static async decr(data: any, pair: any): Promise<undefined> {
        if (!pair) {
            throw new Error(`Cannot encrypt data, because user key is not defined.`);
        }
        return await SEA.decrypt(data, pair) as undefined;
    }
}
