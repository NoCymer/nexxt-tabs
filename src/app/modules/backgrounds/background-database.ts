import { Dexie, type Table } from 'dexie';
import Background from "./models/background";

export default class BackgroundDatabase extends Dexie {
    backgrounds!: Table<Background, number>

    constructor() {
        super('Backgrounds');
        this.version(3).stores({
            backgrounds: '++id',
        });
    }
}

export const db = new BackgroundDatabase();