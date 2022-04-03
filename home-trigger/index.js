const { QueryMetricsConstants } = require('@azure/cosmos');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://comp4522postsdb:kMB9pyE71XmlOUe4tS0rYLsfzm819kpzireKoklGq2dBJxTOKYageRDbqq78MvkqW8oKjyIRehj89bHznBhi4w==@comp4522postsdb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@comp4522postsdb@";

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let dbResult = await dbquery(req.query.page)

    context.log(dbResult)

    context.res.headers = { "Content-Type": "application/json" };
    context.res.body = {dbResult};

}

async function dbquery(page) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
    .catch(err => { console.log(err); });
    
    try {

        const db = client.db("blog");

        let collection = db.collection('posts');

        // let query = { 'post_id': {$gt: parseInt(postid)} }

        let result = await collection.find().sort({$natural: 1}).limit(5).toArray();

        return result;

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }

}