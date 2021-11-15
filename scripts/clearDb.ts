#!/usr/bin/env ts-node

import { MongoDbConnection } from "@js-soft/docdb-access-mongo";

async function clearDb() {
    const connectionString = "mongodb://localhost:27017/?readPreference=primary&appname=clearDb&ssl=false";
    const dbConnection: MongoDbConnection = new MongoDbConnection(connectionString);
    await dbConnection.connect();

    const adminDb = dbConnection.client.db("admin").admin();

    const list = (await adminDb.listDatabases({ nameOnly: true })) as any;
    const databases = list.databases;

    for (const database of databases) {
        const dbName = database.name;
        if (dbName !== "local" && dbName !== "admin" && dbName !== "config") {
            console.log(`dropping db '${dbName}'`);

            const db = dbConnection.client.db(dbName);
            await db.dropDatabase();
        }
    }
}

console.log("dropping all dbs");
clearDb()
    .then(() => {
        console.log("dbs dropped");
        process.exit(0);
    })
    .catch(() => console.log("init db failed"));
