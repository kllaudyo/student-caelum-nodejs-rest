var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var morgan = require('morgan'); //específico para escrever logs com express
var logger = require('../servicos/logger');

module.exports = function(){

    var app = express();

    app.use(morgan('common',{
        stream: {
            write: function(message){
                logger.info(message);
            }
        }
    }));

    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(validator());

    consign()
        .include('controllers')
        .then('persistencia')
        .then('servicos')
        .into(app);

    return app;

};