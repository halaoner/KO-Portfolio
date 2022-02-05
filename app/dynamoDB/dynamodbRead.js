const AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-west-1",
    endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

console.log("Querying for username.");

const params = {
    TableName: "Users",
    ProjectionExpression: "username, password",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: {
        ":username": "Tom"
    }
};

docClient.query(params, function (err, data) {
    if (err) {
        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function (item) {
            console.log("username:", item.username + "; " + "password:", item.password)
        });
    }
});
