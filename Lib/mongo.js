const { MongoClient } = require("mongodb");

const config = {
  url: "mongodb+srv://CommentDB:CommentDB@db2a2cluster1.z4s58.mongodb.net/CommentsDB?retryWrites=true&w=majority",
  dbName: "CommentsDB"
};

async function createConnection() {
  const connection = await MongoClient.connect(config.url, {
    useNewUrlParser: true
  });
  const db = connection.db(config.dbName);
  return {
    connection,
    db
  };
}

module.exports = createConnection;