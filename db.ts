import { MongoClient, Db, Collection } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'placeholder-uri';
if (!process.env.MONGO_URI && process.env.NODE_ENV === 'production') {
    console.warn('MONGO_URI is not defined during production runtime.');
    throw new Error('MONGO_URI environment variable is not defined in production.');
}

const DB_NAME = 'mp-5-alias-board';
export const ARCHIVE_COLLECTION = 'alias-archive';

let client: MongoClient | null = null;
let db: Db | null = null;

async function connect(): Promise<Db> {
    if (!MONGO_URI || MONGO_URI === 'placeholder-uri') {
        throw new Error('Invalid MONGO_URI. Cannot connect to the database.');
    }

    if (!client) {
        client = new MongoClient(MONGO_URI);
        await client.connect();
    }
    return client.db(DB_NAME);
}

export default async function getCollection(
    collectionName: string,
): Promise<Collection> {
    if (!db) {
        db = await connect();
    }
    return db.collection(collectionName);
}
