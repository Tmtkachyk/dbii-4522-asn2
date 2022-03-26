/*
Author: Mostafa Mohamed
Course: COMP 4522, Database II: Advanced Databases
MRU University, Calgary, Canada
*/
// A demo how to connect from an Azure Function to another Azure Function
// Use Axios library to send http request to another url and get the response
// https://www.npmjs.com/package/axios
const axios = require('axios').default;

// After you deploy on Azure, you must add the Blog function URL string 
// "BlogFunctionURL" with its value in the:
// Azure Portal-> Your Function App-> Configuration-> Application Settings (Not connection string)


// To test the function, you can either use Pastman application to sent the requests or use "Curl" command prompt 
// Example usage:
// curl  http://localhost:7071/api/Home
// curl -X POST -H "Content-Type: application/json" -d "{\"title\":\"Just a title\"}" http://localhost:7071/api/Home
// curl -X DELETE -v http://localhost:7071/api/Home?id=62324be964460b98d1f0c7f0
let function_url = process.env["BlogFunctionURL"];

// This Azure function prepares the request data and connect to the other Azure function
module.exports = async function (context, req) {
    // If you don't put the other function URL, you can set it here (not recommended)
    function_url = function_url || 'https://mynotes32.azurewebsites.net/api/blog?code=KqTnEJPzTg66autv0w%2FHeqGx1Cx4Ly%2Fm2ok9Y7CkyuyqeDz4aILxDg%3D%3D__1'
    let method = null, data = null;
    switch (req.method) {
        case "GET":
            // Demo GET request
            // ================
            method = 'get';   // the HTTP method, can be get, post, put, patch, delete, etc.
            data = {  // any data you like to send to the other function
                // "id": "622999fc3eb6b9f1bc763bc7"  // to get one post, specify the post id
            };
            break;
        case "POST":    // Adds new post
            method = 'post';   // the HTTP method, can be get, post, put, patch, delete, etc.
            data = {  // any data you like to send to the other function
                "title": (req?.body && req?.body?.title) || "New post title",
                "text": (req?.body && req?.body?.text) || `New post on ${(new Date()).toLocaleString()}`
            };
            break;
        case "PATCH":   // Update existing record
            method = 'patch';   // the HTTP method, can be get, post, put, patch, delete, etc.
            data = {  // any data you like to send to the other function
                "id": (req?.body && req?.body?.id) || "622999fc3eb6b9f1bc763bc7",    // Existing record id
                "title": (req?.body && req?.body?.title) || "New post title",
                "text": (req?.body && req?.body?.text) || `New post on ${(new Date()).toLocaleString()}`
            };
            break;
        case "DELETE":
            method = 'delete';   // the HTTP method, can be get, post, put, patch, delete, etc.
            data = {  // any data you like to send to the other function
                "id": req?.query.id || (req?.body && req?.body?.id) || "622999fc3eb6b9f1bc763bc7"    // Existing record id
            };
            break;
        default:
            throw Error(`${req.method} not allowed`)
    }

    // Connect to another Azure Function to send and get data 
    context.res = await getResponse(function_url, method, data);

}

// You can use this function. This function sends the request and returns the response
async function getResponse(url, method, data) {
    try {
        const response = await axios({ method, url, data });    // Sends asynchronous request
        console.log(response.data);
        if (response.status == 200) {       // Ok response
            return {
                // status: 200, /* Defaults to 200 */
                body: response.data
            };
        } else {
            return {
                status: response.status, /* Defaults to 200 */
                body: response
            };
        }
    } catch (error) {
        console.error(error);
        return {
            status: response.status, /* Defaults to 200 */
            body: error
        };
    }
}