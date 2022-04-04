const { QueryMetricsConstants, ConflictResolutionMode } = require('@azure/cosmos');
const { ObjectId } = require('mongodb');

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://comp4522postsdb:o7qP1jLcCNnY3J2hEfRYxdLUZyZpZgoIttrH4NY8aAvFxgUXoEPjVoHcZT0x85hHBnawY06W8isPp7q4umfyBQ==@comp4522commentsdb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@comp4522commentsdb@";

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.postid) {
        let dbResult = await dbquery(req.query.postid)

        context.log(dbResult)
    
        context.res.headers = { "Content-Type": "application/json" };
        context.res.body = {dbResult};
    } else if (req.query.deletecomment) {
        let dbResult = await deletequery(req.query.deletecomment)

        context.log(dbResult)
    
        context.res.headers = { "Content-Type": "application/json" };
        context.res.body = {dbResult};
    } else if (req.body) {
        // context.res = {
        //     body: req.body.post_id
        // }
        let dbResult = await addquery(req.body.post_id, req.body.text)

        context.log(dbResult)
    
        context.res.headers = { "Content-Type": "application/json" };
        context.res.body = {dbResult};
    }

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

async function addquery(postid, text) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
    .catch(err => { console.log(err); });
    
    try {

        const db = client.db("blog");

        let collection = db.collection('Comments');

        let today = new Date()

        let date = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}.${today.getMilliseconds()}+00:00`

        let doc = { 
            "text": text,  
            "creation_date": date,  
            "post_id": parseInt(postid),
            "user_id": 99999999,  
            "score": 0,
            "display_name": "Anonymous"
         }

        let result = await collection.insertOne(doc);

        return result;

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }

}

async function deletequery(commentid) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
    .catch(err => { console.log(err); });
    
    try {

        const db = client.db("blog");

        let collection = db.collection('Comments');

        let query = { '_id': ObjectId(commentid) }

        

        let result = await collection.deleteOne(query);

        return result;

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }

}