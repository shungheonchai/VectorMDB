//Run this with "node vectorMongo.js"

const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

async function getEmbedding(query) {
    // Define the OpenAI API url and key.
    const url = 'https://api.openai.com/v1/embeddings';
    const openai_key = process.env.OpenAPI;

    // Call OpenAI API to get the embeddings.
    let response = await axios.post(url, {
        input: query,
        model: "text-embedding-ada-002"
    }, {
        headers: {
            'Authorization': `Bearer ${openai_key}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 200) {
        console.log("status: "+response.status);
        console.log("statusText: "+response.statusText);
        let api_config = response.config;
        api_config.headers.Authorization = "****** REDACTED ******"
        console.log(api_config);
        console.log("\n\n\n\n\n\n");
        return response.data.data[0].embedding;
    } else {
        throw new Error(`Failed to get embedding. Status code: ${response.status}`);
    }
};

async function findSimilarDocuments(embedding) {
    const url = process.env.MongoAtlasString
    const client = new MongoClient(url);

    try {
        await client.connect();

        const db = client.db('sample_mflix'); // Replace with your database name
        const collection = db.collection('embedded_movies'); // Replace with your collection name

        // Query for similar documents.
        const documents = await collection.aggregate([

            {
                "$vectorSearch": {
                    "queryVector": embedding,
                    "path": "plot_embedding",
                    "numCandidates": 100,
                    "limit": 3, //Change to the desired number of outputs
                    "index": "moviePlotVectorIndex", // Reaplce with your index name
                    // "filter":{ "year":2000}
                }
            },
            {
                "$project":{
                    "title": 1,
                    "plot" : 1,
                    "released": 1,
                    "score": { "$meta": "vectorSearchScore" }
                }
            },
            {
                "$sort":{"score":-1}
            }
            
        ]).toArray();

        return documents;
    } finally {
        await client.close();
    }
};

async function main() {

    const query = process.argv.slice(2)
    try {
        const embedding = await getEmbedding(query);
        console.log("Embedding of \""+query+"\"");
        console.log(embedding);
        console.log("\n\n\n\n\n\n");
        const documents = await findSimilarDocuments(embedding);
        console.log(documents);
    } catch (err) {
        console.error(err);
    }
};

main();