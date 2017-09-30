var memcached = require('memcached');

var client = new memcached('localhost:11211', {
    retries: 10, // numeros de tentativas
    retry: 10000, //tempo em milisegundos em falha de um servidor
    remove: true // autorizando o memcached a remover do pull nó não encontrado
});

client.set('pagamento-20',{'pagamento':20}, 60000, function(err){
    console.log('nova chave adicionada ao cache');
});

client.get('pagamento-20', function(err, result){
    if(err || !result){
        console.log('MISS - chave não encontrada', err)
    }else{
        console.log('HIT - valor encontrado', result);
    }
});