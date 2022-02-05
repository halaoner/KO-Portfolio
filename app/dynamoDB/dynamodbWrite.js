const AWS = require("aws-sdk");
const bcrypt = require('bcrypt')


AWS.config.update({
    region: "eu-west-1",
    endpoint: "http://localhost:8000"
});

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });



const hashPassword = async (password) => {
    //---- 10 is number of rounds - less number means quicker generation of hash
    // console.log('password1:', password)
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    console.log('This is the generated salt:', salt)
    //---- salt is the part of the hashed password
    console.log('This is the hashed password:', hash)
    // let buff = new Buffer.from(hash);
    // let base64data = buff.toString('base64');

    // console.log('original hash:', hash + ' converted to Base64:', base64data)

    return hash
}


async function writeData(param1, param2) {
    const params = {
        TableName: 'Users',
        Item: {
            'username': { S: param1 },
            'password': { S: param2 }
        }
    };

    // Call DynamoDB to add the item to the table
    // ddb.putItem(params, function (err, data) {
    //     if (err) {
    //         console.log("Error", err);
    //     } else {
    //         console.log("Success", data);
    //     }
    // })

    try {
        await ddb.putItem(params).promise()
        const username = params.Item.username
        const hash = params.Item.password
        console.log("Success", { username, hash });
    } catch (err) {
        console.log("Error:", err);
    }
};

async function hashAndSaveData() {
    const param1 = 'Omar'
    const param2 = await hashPassword('admin12221')
    await writeData(param1, param2)
    console.log('Hashed and Saved')
}

hashAndSaveData()
