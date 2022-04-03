const { QueryMetricsConstants } = require('@azure/cosmos');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://comp4522postsdb:o7qP1jLcCNnY3J2hEfRYxdLUZyZpZgoIttrH4NY8aAvFxgUXoEPjVoHcZT0x85hHBnawY06W8isPp7q4umfyBQ==@comp4522commentsdb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@comp4522commentsdb@";

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let dbResult = await dbquery(req.query.postid)

    context.log(dbResult)

    context.res.headers = { "Content-Type": "application/json" };
    context.res.body = {dbResult};

}

async function dbquery(postid) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
    .catch(err => { console.log(err); });
    
    try {

        const db = client.db("blog");

        let collection = db.collection('Comments');

        let query = { 'post_id': parseInt(postid) }

        let result = await collection.find(query).toArray();

        return result;

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }

}