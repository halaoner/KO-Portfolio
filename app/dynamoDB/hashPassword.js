const bcrypt = require('bcrypt');

const saltRounds = 10;
const yourPassword = "someRandomPasswordHere";


hashedPassword1 = bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(yourPassword, salt, function (err, hash) {
        // Store hash in your password DB.
        console.log('Plain text password:', yourPassword)
        console.log('salt rounds:', saltRounds)
        console.log('salt:', salt)
        console.log('hashed password:', hash)
        console.log('salt + hash', salt + ' --- ' + hash)
    });
})

console.log('hashedPassword1:', hashedPassword1)
// hashedPassword1()


// const comparePassword = async (yourPassword, hash) => {
//     try {
//         // Compare password
//         // return await bcrypt.compare(yourPassword, hash);
//         bcrypt.compare(yourPassword, hash);
//         console.log('your pwd:', yourPassword)

//     } catch (error) {
//         console.log(error);
//     }

//     // // Return false if error
//     // console.log('error')
//     // return false;
// };

// comparePassword('someRandomPasswordHere', '123')

// Load hash from your password DB.
// const compare = bcrypt.compareSync(yourPassword, hash);
// console.log(compare)

// const hashPassword = async (password, saltRounds = 10) => {
//     try {
//         // Generate a salt
//         const salt = await bcrypt.genSalt(saltRounds);

//         // Hash password
//         return await bcrypt.hash(password, salt);
//     } catch (error) {
//         console.log(error);
//     }

//     // Return null if error
//     return null;
// };

// console.log('hash pwd:', hashPassword)


// const hash = bcrypt.hash(yourPassword, saltRounds);
// console.log('hash -->', hash)

// const hashedPassword2 = bcrypt.genSalt(saltRounds, function (err, salt) {
//     bcrypt.hash(yourPassword, salt, function (err, hash) {
//         // Store hash in your password DB.
//         console.log('Hashed password 2:', hashedPassword2)
//     });
// });

// console.log('Hashed password:', hashedPassword)

// const hash = bcrypt.hashSync(yourPassword, saltRounds);
// console.log('Hash password --> ', hash)

// // Load hash from the db, which was preivously stored
// bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
//   // if res == true, password matched
//   // else wrong password
// });
