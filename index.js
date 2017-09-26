var Log = require('./Log');
var express = require('express');
var app = express();

app.listen(3000, function(){
   // console.log('servidor escutando requisicoes http na porta 3000');
   Log.d('Servidor escutando requisicoes http na porta 3000');
});

app.get('/pagamentos',function(request, response){
    Log.d('recebendo requisicao para /pagamentos');
    response.end('OK');
});