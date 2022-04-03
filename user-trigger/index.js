const { Connection, Request } = require("tedious");

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Create connection to database
    const config = {
        authentication: {
            options: {
            userName: "comp4522",
            password: "login2022!"
            },
            type: "default"
        },
        server: "project2database.database.windows.net",
        options: {
            database: "Users",
            encrypt: true,
            rowCollectionOnRequestCompletion: true
        }
    };

    const connection = new Connection(config);

    let result = [];

    // Read all rows from table
    const request = new Request(
        `SELECT TOP (1) [id]
        ,[user_id]
        ,[display_name]
        ,[about_me]
        ,[age]
        ,[creation_date]
        ,[last_access_date]
        ,[location]
        ,[reputation]
        ,[up_votes]
        ,[down_votes]
        ,[views]
        ,[profile_image_url]
        ,[website_url]
      FROM [dbo].[user_data] WHERE [user_id] = ${req.query.userid}`,
        (err, rowCount) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`${rowCount} row(s) returned`);
            console.log(result);
            context.res.headers = { "Content-Type": "application/json" };
            context.res.body = {result};
            context.done()
        }
    });

    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", err => {
        if (err) {
          console.error(err.message);
        } else {
          connection.execSql(request);
        }
    });

    request.on("row", (columns) => {
    const entry = {};
    columns.forEach((column) => {
        entry[column.metadata.colName] = column.value;
    });
    result.push(entry);
    });

    connection.connect();

}