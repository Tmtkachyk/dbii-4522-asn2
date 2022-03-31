const { Connection, Request } = require("tedious");

module.exports = async function (context, req) {

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

    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", err => {
    if (err) {
        console.error(err.message);
    } else {
        queryDatabase().then(result => {
            console.log(result);
        }).catch(error => {
            console.log("error")
        });
    }
    });

    connection.connect();

    function queryDatabase() {
    console.log("Reading rows from the Table...");

    // Read all rows from table
    const request = new Request(
        `SELECT TOP (1) [user_id]
        ,[profile_image_url]
        ,[website_url]
    FROM [dbo].[user_urls]`,
        (err, rowCount) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`${rowCount} row(s) returned`);
        }
        }
    );

    // return new Promise((resolve, reject) => {
    //     const result = [];
  
    //     request.on("row", (columns) => {
    //       const entry = {};
    //       columns.forEach((column) => {
    //         entry[column.metadata.colName] = column.value;
    //         // console.log("%s\t%s", column.metadata.colName, column.value);
    //       });
    //       result.push(entry);
    //     //   console.log(result)
    //     });

    //     request.on('error',error=>reject(error));// some error happened, reject the promise
    //     request.on('done',()=>resolve(result)); // resolve the promise with the result rows.
    //     request.on('doneProc',()=>resolve(result)); // resolve the promise with the result rows.
    //     request.on('doneInProc',()=>resolve(result)); // resolve the promise with the result rows.
    //     request.on('requestCompleted', function() {
    //         context.res.headers = { "Content-Type": "application/json" };
    //         context.res.body = {
    //             success: true,
    //             message: "result"
    //         };
    //     });
        
    //     connection.execSql(request);
    // });

    const result = [];
  
    request.on("row", (columns) => {
      const entry = {};
      columns.forEach((column) => {
        entry[column.metadata.colName] = column.value;
        // console.log("%s\t%s", column.metadata.colName, column.value);
      });
      result.push(entry);
    //   console.log(result)
    });

    request.on('requestCompleted', function() {
        context.res = {
            status: 200, /* Defaults to 200 */
            body: {result},
            headers: {
                'Content-Type': 'application/json'
            }
        }
        context.done
    });
    
    connection.execSql(request);

    
    }

    context.log('JavaScript HTTP trigger function processed a request.');

    // context.res = {
    //     body: "test this"
    // }
    // context.done()

}