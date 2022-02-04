import { v4 as uuidv4 } from 'uuid';
import { EncryptionUtils } from '../utils/encryption-utils';
import { RandomUtils } from '../utils/random-utils';
import { Database } from '../data/database';
import type { KeyShare } from '../models/key-share';

export class KeySharing {

    private static keySharingNodeName = 'key-sharing';
    private static db = new Database();

    /**
     * Creates a new SEA Keypair and stores it (encrypted) on the key-sharing node.
     * @returns A share key to retrieve the SEA keypair from the key-sharing node.
     */
    public static async createKeyPairAndShareKey(additionalData?: string, randomKey?: string): Promise<string> {
        const key = uuidv4();

        const randomText = await RandomUtils.getRandomText();
        const passphrase = RandomUtils.shuffleStringsTogether((randomKey ?? '').replace(/[\W_]+/g, "") + randomText, uuidv4());

        const keyPair = await EncryptionUtils.createKeypair();

        const keyShare: KeyShare = {
            keyPair: keyPair,
            additionalData: additionalData
        }

        const keyShareString = JSON.stringify(keyShare);
        await this.db.putSecure(`${this.keySharingNodeName}.${key}`, keyShareString, passphrase, false);
        return `${key}:${passphrase}`;
    }

    public static async getKeyPair(shareKeyString: string): Promise<KeyShare> {
        if (!shareKeyString) {
            return undefined;
        }

        const splittedShareKey = shareKeyString.split(':');
        if (splittedShareKey.length !== 2) {
            return undefined;
        }

        const key = splittedShareKey[0];
        const passphrase = splittedShareKey[1];

        const decrypted = await this.db.onceSecure(`${this.keySharingNodeName}.${key}`, passphrase, false);
        if (!decrypted) {
            throw new Error('Could not load shareKey information');
        }
        return typeof decrypted === 'string' ? JSON.parse(decrypted) : decrypted;
    }

    public static extractKey(shareKey: string): string {
        if (!shareKey) {
            return undefined;
        }

        const splittedShareKey = shareKey.split(':');
        if (splittedShareKey.length !== 2) {
            return undefined;
        }
        return splittedShareKey[0];
    }

}