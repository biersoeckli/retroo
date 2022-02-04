import { Database } from "../data/database";
import type { Column } from "../models/column";
import type { KeyShare } from "../models/key-share";
import type { Retro } from "../models/retro";
import { KeySharing } from "./key-sharing";
import { v4 as uuidv4 } from 'uuid';
import { AnonymousUserManager } from "./anonymous-user-manager";
import type { Card } from "../models/card";
import { EncryptionUtils } from "../utils/encryption-utils";
import { RandomColorGenerator } from "../utils/random-color-generator";

export const retroNodeName = 'retro'

export class RetroManager {

    shareKeyString: string;
    retroKeyShare: KeyShare;
    public retro: Retro;
    public cards: Card[];
    private db: Database;

    private static _instance: RetroManager;
    public static get instance(): RetroManager {
        if (!this._instance) {
            this._instance = new RetroManager();
        }
        return this._instance;
    }

    private constructor() {
        this.db = new Database();
        this.cards = [];
    }

    public async createNewRetro(name: string) {
        const retroId = uuidv4();
        this.shareKeyString = await KeySharing.createKeyPairAndShareKey(retroId, name);
        this.retroKeyShare = await KeySharing.getKeyPair(this.shareKeyString);

        this.retro = {
            id: retroId,
            name: name,
            createdAt: new Date(),
            showCardData: false,
            createdBy: AnonymousUserManager.getUserId(),
            columns: [
                {
                    id: uuidv4(),
                    name: 'Stop',
                    color: 'red'
                },
                {
                    id: uuidv4(),
                    name: 'Start',
                    color: 'blue'
                },
                {
                    id: uuidv4(),
                    name: 'Continue',
                    color: 'green'
                }
            ]
        };

        await this.saveRetro();
    }

    public createNewColumn(): Column {
        return {
            id: uuidv4(),
            name: '',
            color: RandomColorGenerator.getRadmonColor()
        };
    }

    public async initializeAndListenWithSharedKey(shareKey: string, changeListener: (retro: Retro) => void) {
        
        await this.initializeWithSharedKey(shareKey);

        this.db.onSecure(`${this.retroKeyShare.additionalData}.${retroNodeName}.meta`, this.retroKeyShare.keyPair, (ack: Retro) => {
            if (ack) {
                this.retro = ack as Retro;
                changeListener(this.retro);
            }
        });
    }

    public async initializeWithSharedKey(shareKey: string) {
        this.shareKeyString = shareKey;
        this.retroKeyShare = await KeySharing.getKeyPair(this.shareKeyString);
        this.retro = await this.db.onceSecure(`${this.retroKeyShare.additionalData}.${retroNodeName}.meta`, this.retroKeyShare.keyPair) as Retro;
    }

    public async saveRetro() {
        if (!this.retro || this.retro.createdBy !== AnonymousUserManager.getUserId()) {
            throw new Error('Cannot save retro, because the user is not permitted.');
        }
        await this.db.putSecure(`${this.retro.id}.${retroNodeName}.meta`, JSON.stringify(this.retro), this.retroKeyShare.keyPair);
    }

    public async saveCard(card: Card) {
        if (!card || !card.text) {
            throw new Error('Cannot save card.');
        }

        const copyCard = { ...card };

        const userId = AnonymousUserManager.getUserId();
        const encryptedText = await EncryptionUtils.encrypt(copyCard.text, this.retroKeyShare.keyPair);

        if (!copyCard.id) {
            copyCard.id = uuidv4();
            copyCard.text = encryptedText;
            copyCard.createdBy = userId;
            copyCard.createdAt = new Date().toISOString() as any;
            // await this.db.put(`${this.retro.id}.${retroNodeName}.cards.${copyCard.id}`, copyCard);
            await this.db.put(`${this.retro.id}.${retroNodeName}.cards.${copyCard.id}`, copyCard);
        } else {
            await this.db.put(`${this.retro.id}.${retroNodeName}.cards.${copyCard.id}.text`, encryptedText);
        }
    }

    public async decodeData(card: Card): Promise<Card> {
        const cardCopy = { ...card };
        cardCopy.text = await EncryptionUtils.decrypt(cardCopy.text, this.retroKeyShare.keyPair);
        return cardCopy;
    }

    private startCardListener() {
        this.db.db.get(this.retro.id).get(retroNodeName).get('cards').map().once(async (card: Card) => {

            card.text = await EncryptionUtils.decrypt(card.text, this.retroKeyShare.keyPair);

            if (!this.retro.showCardData) {
                card.text = card.text.replace(/[\W_]+/g, "*");
            }

            const existingCardInArray = this.cards.find(x => x.id === card.id);
            if (existingCardInArray) {
                existingCardInArray.text = card.text;
            } else {
                this.cards.push(card);
            }
        });
    }
}