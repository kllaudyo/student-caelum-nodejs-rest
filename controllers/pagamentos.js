
var Log = require('../Log');

module.exports = function(app){

    app.get('/pagamentos',function(request, response) {
        Log.d('recebendo requisicao para /pagamentos');
        response.end('OK');
    });

    app.post('/pagamentos/pagamento',function(request, response){
        Log.d(request.body);
        response.send('ok\n');
    });
};