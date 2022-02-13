const AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-west-1",
    endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const table = "Users";

const username = 'Tom'
const password = 'Tom123'

const params = {
    TableName: table,
    Key: {
        "username": username,
        "password": password
    },
};

console.log("Attempting a conditional deconste...");
docClient.deconste(params, function (err, data) {
    if (err) {
        console.error("Unable to deconste item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("DeconsteItem succeeded:", JSON.stringify(data, null, 2));
    }
});
