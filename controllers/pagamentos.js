
var Log = require('../Log');

module.exports = function(app){

    app.get('/pagamentos',function(request, response) {

        var connection = app.persistencia.connectionFactory();
        var dao = new app.persistencia.PagamentoDAO(connection);

        dao.findAll(function (err, result) {
            if(err){
                response.status(400);
                response.json({'error':err});
                console.log(err);
            }else{
                response.status(200).json(result);
            }
        });

    });

    app.get('/pagamentos/pagamento/:id', function (request, response) {

        var id = request.params.id;

        var memcached = app.servicos.memcachedClient();

        memcached.get('pagamento-' + id, function (err, pagamentoJson) {
            if(err || !pagamentoJson){

                //não encontrou - MISS
                var connection = app.persistencia.connectionFactory();
                var dao = new app.persistencia.PagamentoDAO(connection);

                dao.findById(id, function(err, result){
                    if(err || result.length === 0){
                        response.status(400);
                        response.json({'id':id,'message':'recurso não existe'});
                        console.log(err);
                    }else {
                        console.log('encontrou no banco de dados')
                        var pagamento = result[0];
                        response.status(200);
                        response.json(pagamento);
                    }
                })
            }else{
                //encontrou - HIT
                console.log('encontrado via memcached');
                response.status(200);
                response.json(pagamentoJson)
            }
        });



    });

    app.post('/pagamentos/pagamento',function(request, response){

        request.assert('pagamento.forma_de_pagamento', 'Forma de pagamento é obrigatório').notEmpty();
        request.assert('pagamento.valor','O valor e obrigatorio e deve ser um decimal').notEmpty().isFloat();
        request.assert('pagamento.moeda','Moeda é obrigatória e deve ter 3 caracteres').notEmpty().len(3,3);

        //aconteceu algum erro?
        var erros = request.validationErrors();
        if(erros){

            Log.d("Erro de validação");
            response.status(400);
            response.json(erros);

        }else {

            var pagamento = request.body["pagamento"];
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

                var memcached = app.servicos.memcachedClient();

                pagamento.id_pagamento = result.insertId;

                var clienteCartoes = new app.servicos.clienteCartoes();

                if(pagamento.forma_de_pagamento === 'cartao'){

                    var cartao = request.body['cartao'];
                    clienteCartoes.autorizar(cartao, function(err, result){

                        if(err){
                            Log.e(err);
                            response.status(400);
                            response.send(err);
                            return;
                        }

                        if(result.status==='AUTORIZADO'){
                            response.status(201);
                            response.location('/pagamentos/pagamento/' + pagamento.id_pagamento);

                            //descrevendo as proximas ações
                            //HATEOAS
                            //Hypermedia As The Engine of Application State
                            var hateoas = {
                                pagamento: pagamento,
                                links: [
                                    {
                                        rel: "CONFIRMAR",
                                        method: "PUT",
                                        href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id_pagamento
                                    },
                                    {
                                        rel: "CANCELAR",
                                        method: "DELETE",
                                        href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id_pagamento
                                    }

                                ]
                            };

                            //adicionando json criado no memcached
                            memcached.set('pagamento-' + pagamento.id_pagamento, pagamento, 120000, function(err){
                                console.log('adicionado no memcached');
                            });
                            response.json(hateoas);
                        }
                    });

                }else {

                    response.status(201);
                    response.location('/pagamentos/pagamento/' + pagamento.id_pagamento);

                    //adicionando json criado no memcached
                    memcached.set('pagamento-' + pagamento.id_pagamento, pagamento, 120000, function(err){
                        console.log('adicionado no memcached');
                    });

                    //descrevendo as proximas ações
                    //HATEOAS
                    //Hypermedia As The Engine of Application State
                    var hateoas = {
                        pagamento: pagamento,
                        links: [
                            {
                                rel: "CONFIRMAR",
                                method: "PUT",
                                href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id_pagamento
                            },
                            {
                                rel: "CANCELAR",
                                method: "DELETE",
                                href: 'http://localhost:3000/pagamentos/pagamento/' + pagamento.id_pagamento
                            }

                        ]
                    };

                    response.json(hateoas);
                }

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