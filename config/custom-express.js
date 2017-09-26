var express = require('express');
var consign = require('consign');
//criando aplicacao express
module.exports = function(){
    var app = express();

    consign()
        .include('controllers')
        .into(app);

    return app;
};