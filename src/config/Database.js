const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to the database');
        return client.db();
    } catch (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
}

module.exports = { connectDB };
