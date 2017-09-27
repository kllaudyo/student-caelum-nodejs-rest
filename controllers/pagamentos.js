
var Log = require('../Log');

module.exports = function(app){

    app.get('/pagamentos',function(request, response) {
        Log.d('recebendo requisicao para /pagamentos');
        response.end('OK');
    });

    app.post('/pagamentos/pagamento',function(request, response){

        Log.d('Recebendo requisicao de pagamento');

        request.assert('forma_de_pagamento', 'Forma de pagamento é obrigatório').notEmpty();
        request.assert('valor','O valor e obrigatorio e deve ser um decimal').notEmpty().isFloat();

        //aconteceu algum erro?
        var erros = request.validationErrors();
        if(erros){

            Log.d("Erro de validação");
            response.status(400);
            response.json(erros);

        }else {

            var pagamento = request.body;
            pagamento.status = "CRIADA";
            pagamento.data = new Date();

            var connection = app.persistencia.connectionFactory();
            var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);
            pagamentoDAO.save(pagamento, function (err, result) {

                if (err) {
                    Log.e(err);
                    response.status(500);
                    response.send(err);
                    return;
                }

                Log.d("salvo com sucesso");
                response.status(201);
                response.location('/pagamentos/pagamento/' + result.insertId);
                response.json(pagamento);

            });
        }
    });
};