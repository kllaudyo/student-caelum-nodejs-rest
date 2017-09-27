
var Log = require('../Log');

module.exports = function(app){

    app.get('/pagamentos',function(request, response) {
        Log.d('recebendo requisicao para /pagamentos');
        response.end('OK');
    });

    app.post('/pagamentos/pagamento',function(request, response){

        request.assert('forma_de_pagamento', 'Forma de pagamento é obrigatório').notEmpty();
        request.assert('valor','O valor e obrigatorio e deve ser um decimal').notEmpty().isFloat();
        request.assert('moeda','Moeda é obrigatória e deve ter 3 caracteres').notEmpty().len(3,3);

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
            pagamentoDAO.insert(pagamento, function (err, result) {

                if (err) {
                    Log.e(err);
                    response.status(500);
                    response.send(err);
                    return;
                }

                pagamento.id_pagamento = result.insertId;

                response.status(201);
                response.location('/pagamentos/pagamento/' + pagamento.id_pagamento);

                //descrevendo as proximas ações
                var hateoas = {
                    pagamento: pagamento,
                    links: [
                        {
                            rel:"CONFIRMAR",
                            method:"PUT",
                            href:'http://localhost:3000/pagamentos/pagamento/' + pagamento.id_pagamento
                        },
                        {
                            rel:"CANCELAR",
                            method:"DELETE",
                            href:'http://localhost:3000/pagamentos/pagamento/' + pagamento.id_pagamento
                        }

                    ]
                };

                response.json(hateoas);

            });
        }
    });

    app.put('/pagamentos/pagamento/:id', function(request, response){

        var id = request.params.id;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.findById(id, function(err, result){

            if(err || result.length === 0){
                response.status(400);
                response.json({'id':id,'message':'recurso não existe'});
                console.error(err);
                return;
            }

            var pagamento = result[0];

            pagamento.status = 'CONFIRMADO';
            pagamento.data = new Date();


            pagamentoDAO.update(pagamento, function (err) {

                if(err){
                    response.status(500);
                    response.json({'id':id,'error':err});
                    console.error(err);
                    return;
                }

                response.status(200);
                response.json(pagamento);

            });


        });

    });

    app.delete('/pagamentos/pagamento/:id',function(request, response){

        var id = request.params.id;
        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.findById(id, function (err, result) {
            if(err || result.length === 0){
                response.status(400);
                response.json({'id':id,'message':'recurso não existe'});
                console.error(err);
                return;
            }

            var pagamento = result[0];
            pagamento.status = 'CANCELADO';
            pagamento.data = new Date();


            pagamentoDAO.update(pagamento, function(err){
                if(err){
                    response.status(500);
                    response.json({'id':id,'error':err});
                    console.error(err);
                    return;
                }

                response.status(204); //atualizado, mas não existe mais
                response.json(pagamento);

            });

        });

    });
};