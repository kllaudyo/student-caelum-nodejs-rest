var mysql = require('mysql');

function doConnection(){
    return mysql.createConnection({
        host:'localhost',
        user:'root',
        password :'root',
        database:'payfast'
    });
}

module.exports = function(){
    return doConnection;
};