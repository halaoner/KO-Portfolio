const AWS = require("aws-sdk");
const bcrypt = require('bcrypt');
const { use } = require("../routes/admin");

AWS.config.update({
    region: "eu-west-1",
    endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

async function readData(username) {
    const params = {
        TableName: "Users",
        ProjectionExpression: "username, password",
        KeyConditionExpression: "username = :username",
        // KeyConditionExpression: "password = :password and username = :username",
        ExpressionAttributeValues: {
            ":username": username,
            // ":password": savedPassword
        }
    }
    try {
        const data = await docClient.query(params).promise()
        if (data.Count > 0) {
            // console.log("Query succeeded.");
            data.Items.forEach(function (item) {
                // console.log("username:", item.username + "; " + "hashedPassword:", item.password)
                savedUsername = item.username
                savedPassword = item.password
                console.log('Reading from DB: data found!')
            })
        }
        else {
            console.log('Reading from DB: Username or hash DO NOT MATCH with the stored one!')
        }
        //----- 'data' is the result of the readData() function
        return data
    }
    catch (err) {
        // console.log("Error:", err);
        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    }
}

//-------- compare 'password' provided by the user with 'savedPassword' stored in DB --------//
const comparePwd = async (password, savedPassword) => {
    const result = await bcrypt.compare(password, savedPassword)
    if (result) {
        console.log('HASH MATCH! Successfully logged in!')
    } else {
        console.log('HASH NOT MATCHED. Try it again!')
    }
};

async function compare() {
    try {
        const username = 'Katee'
        const password = 'admin123'

        const user = await readData(username)
        const arr = user.Items
        if (arr.length === 0) {
            console.log('User not found in DB')
        } else {
            await comparePwd(password, savedPassword)
            console.log('Read Data:', savedPassword)
        }
    }
    catch (err) {
        console.log('Compare error:', err)
    }
}

compare()

// ------- username, password and hash must match to get following output:
// username: Kate; hashedPassword: $2b$10$mcaXb7BUH3hRKfkMSmhc1uoBXFH4C8iZzcU/MLxqevzpPrUZPSBri
// Reading from DB: data found!
// HASH MATCH! Successfully logged in!
// Data quering done!
