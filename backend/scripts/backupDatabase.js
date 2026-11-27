import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

async function runBackup() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing from environment variables.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const dbName = db.databaseName;

    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const backupBaseDir = path.resolve('../mongodb_backup');
    const backupTimestampDir = path.join(backupBaseDir, `backup_${timestamp}`);
    const latestDir = path.join(backupBaseDir, 'latest');

    fs.mkdirSync(backupTimestampDir, { recursive: true });
    fs.mkdirSync(latestDir, { recursive: true });

    const collections = await db.listCollections().toArray();
    const summary = {
      database: dbName,
      createdAt: now.toISOString(),
      totalCollections: collections.length,
      collections: {}
    };

    console.log(`Starting MongoDB Backup for database: ${dbName}`);
    console.log(`Destination folder: ${backupTimestampDir}`);

    for (const c of collections) {
      const colName = c.name;
      const docs = await db.collection(colName).find({}).toArray();
      summary.collections[colName] = docs.length;

      const jsonContent = JSON.stringify(docs, null, 2);

      // Save into timestamped folder
      fs.writeFileSync(path.join(backupTimestampDir, `${colName}.json`), jsonContent);
      // Save into latest folder
      fs.writeFileSync(path.join(latestDir, `${colName}.json`), jsonContent);

      console.log(`✓ Exported ${colName} (${docs.length} documents)`);
    }

    fs.writeFileSync(path.join(backupTimestampDir, 'summary.json'), JSON.stringify(summary, null, 2));
    fs.writeFileSync(path.join(latestDir, 'summary.json'), JSON.stringify(summary, null, 2));

    console.log('\nBackup successfully completed!');
    console.log(`Summary file: ${path.join(backupTimestampDir, 'summary.json')}`);
    process.exit(0);
  } catch (err) {
    console.error('Backup error:', err);
    process.exit(1);
  }
}

runBackup();
