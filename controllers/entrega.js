module.exports = function(app){

    app.post('/entrega/calcular-prazo', function(request, response){

        var dadosEntrega = request.body;

        console.log(dadosEntrega);

        var correios = new app.servicos.Correios();

        correios.calcularPrazo(dadosEntrega,function(err, result){
            if(err){
                console.error(err);
                response.status(400);
                response.json(err);
            }else{
                response.status(200);
                response.json(result.CalcPrazoResult.Servicos.cServico[0]);
            }

        });

    });
};