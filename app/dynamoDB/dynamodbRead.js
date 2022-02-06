const AWS = require("aws-sdk");
const bcrypt = require('bcrypt')

AWS.config.update({
    region: "eu-west-1",
    endpoint: "http://localhost:8000"
});

const docClient = new AWS.DynamoDB.DocumentClient();

const comparePwd = async (password, savedPassword) => {
    //-------- read data from DB --------//
    async function readData(username, savedPassword) {
        const params = {
            TableName: "Users",
            ProjectionExpression: "username, password",
            KeyConditionExpression: "password = :password and username = :username",
            ExpressionAttributeValues: {
                ":username": username,
                ":password": savedPassword
            }
        }
        try {
            const data = await docClient.query(params).promise()
            if (data.Count > 0) {
                // console.log("Query succeeded.");
                data.Items.forEach(function (item) {
                    console.log("username:", item.username + "; " + "hashedPassword:", item.password)
                    savedUsername = item.username
                    savedPassword = item.password
                    console.log('Reading from DB: data found!')
                    return savedPassword && savedUsername
                })
            }
            else {
                console.log('Reading from DB: Username DOES NOT match with the stored one!')
            }
        }
        catch (err) {
            // console.log("Error:", err);
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
    };

    //-------- read data from DB --------//
    const username = 'Kate'
    readData(username, savedPassword)

    //-------- compare 'password' provided by the user with 'savedPassword' stored in DB --------//
    const result = await bcrypt.compare(password, savedPassword)
    if (result) {
        console.log('HASH MATCH! Successfully logged in!')
    } else {
        console.log('HASH NOT MATCHED. Try it again!')
    }
    return result
}

// TODO: test the functionality properly
async function compareHash() {
    const password = 'admin'
    const savedPassword = '$2b$10$HGvd37u6MEfO6OySnGodOe4HUzbF6eiKdbGF6dDh/.L8l.Z8gaJJ6'
    await comparePwd(password, savedPassword)
    console.log('Data quering done!')
}

compareHash()
