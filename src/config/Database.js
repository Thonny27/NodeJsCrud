const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = 'mongodb+srv://pruebanode:Prueb4N0d3@cluster0.6dicmnn.mongodb.net/TestNode?retryWrites=true&w=majority&appName=Cluster0';
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
