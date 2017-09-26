var Log = require('./Log');
var app = require('./config/custom-express')();

app.listen(3000, function(){
   Log.d('Servidor escutando requisicoes http na porta 3000');
});