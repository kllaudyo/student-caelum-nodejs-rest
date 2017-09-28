var restify = require('restify-clients');

// var client = restify.createJsonClient({
//     url:'http://localhost:3001'
// });
//
// client.post('/cartoes/autorizar',  function(err, request, response, result){
//     console.log('consumindo servico de cartoes');
//     console.log('retorno', result);
// });

var clienteCartoes = function(){
    this._client = restify.createJsonClient({
        'url':'http://localhost:3001'
    })
};

clienteCartoes.prototype.autorizar = function(cartao, callback){
    // console.log('logando o cartao',cartao);
    this._client.post('/cartoes/autorizar', cartao, function(err, request, response, result){
        // console.log('consumindo servico de cartoes');
         console.log('retorno', result);

        callback(result['dados_do_cartao']);

    });
};

module.exports = function(cartao){
    return clienteCartoes;
};