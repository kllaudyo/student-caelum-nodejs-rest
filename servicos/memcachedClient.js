var memcached = require('memcached');

var client = function(){
    return new memcached('localhost:11211', {
        retries: 10, // numeros de tentativas
        retry: 10000, //tempo em milisegundos em falha de um servidor
        remove: true // autorizando o memcached a remover do pull nó não encontrado
    });
};

module.exports = function () {
    return client;
};
