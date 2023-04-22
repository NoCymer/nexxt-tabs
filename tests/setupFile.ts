import indexedDB from 'fake-indexeddb';
import Dexie from 'dexie';
Dexie.dependencies.IDBKeyRange = require('fake-indexeddb/lib/FDBKeyRange');
Dexie.dependencies.indexedDB = indexedDB;
jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: key => key})
}));