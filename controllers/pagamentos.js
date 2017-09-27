
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

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);
        pagamentoDAO.save(pagamento, function(err, result){

            if(err){
                Log.e(err);
                response.send("erro");
                return;
            }

            Log.d("salvo com sucesso");
            response.json(pagamento);

        });

        // response.send(pagamento);
    });
};