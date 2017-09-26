
var Log = require('../Log');

module.exports = function(app){

    app.get('/pagamentos',function(request, response) {
        Log.d('recebendo requisicao para /pagamentos');
        response.end('OK');
    });

    app.post('/pagamentos/pagamento',function(request, response){

        var pagamento = request.body;

        Log.d('Processando uma requisicao de um novo pagamento');

        pagamento.status = "CRIADA";
        pagamento.data = new Date();

        response.send(pagamento);
    });
};