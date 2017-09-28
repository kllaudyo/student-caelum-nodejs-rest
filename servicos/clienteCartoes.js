var restify = require('restify-clients');

var clienteCartoes = function(){
    this._client = restify.createJsonClient({
        'url':'http://localhost:3001'
    })
};

clienteCartoes.prototype.autorizar = function(cartao, callback){
    this._client.post('/cartoes/autorizar', cartao, function(err, request, response, result){
        callback(err, result['dados_do_cartao']);
    });
};

module.exports = function(cartao){
    return clienteCartoes;
};