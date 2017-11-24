const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

let hashedPassword = '$2a$10$BIxg850mm5CYvoIJITJizehBSaAmcoghqL3LQiedpnE56eoFkFsI.';

bcrypt.compare('123abc!', hashedPassword, (err, res) => {
    console.log(res);
});
// let data = {
//     id: 10
// };
// let token = jwt.sign(data, '123abc')
// console.log(token);
// let decoded = jwt.verify(token, '123abc');
// console.log(decoded);
// jwt.verify()
// let message = 'I am a user';
// let hash = SHA256(message).toString();
// console.log(message);
// console.log(hash);
//
// let data = {
//     id: 4
// }
//
// let token = {
//     data,
//     hash : SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// console.log(resultHash === token.hash);
