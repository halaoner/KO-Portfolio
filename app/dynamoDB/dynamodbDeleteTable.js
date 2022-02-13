const AWS = require("aws-sdk");

AWS.config.update({
    region: "eu-west-1",
    endpoint: "http://localhost:8000"
});

const dynamodb = new AWS.DynamoDB();

const params = {
    TableName: "Users"
};

dynamodb.deleteTable(params, function (err, data) {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
