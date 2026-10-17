import {MongoClient, ObjectId } from 'mongodb';

process.loadEnvFile()
const dbName = process.env.DATABASE;
const url = process.env.MONGO_URL;
const collectionName = process.env.COLLECTION;

const client = new MongoClient(url);

export async function getAllContacts() {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return await collection.find().toArray();
}

export async function getContact(id) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return await collection.findOne({
        _id: new ObjectId(id)
    });
}

export async function addContact(contact) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne({
        name: contact.name,
        age: contact.age
    });

    return await collection.findOne({
        _id: result.insertedId
    });
}

export async function updateContact(id, contact) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                name: contact.name,
                age: contact.age
            }
        },
        { returnDocument: 'after' }
    );

    if(result.matchedCount === 0){
        return null;
    }

    return await  getContact(id);
}

export async function deleteContact(id) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return await collection.findOneAndDelete({
        _id: new ObjectId(id)
    });
}

