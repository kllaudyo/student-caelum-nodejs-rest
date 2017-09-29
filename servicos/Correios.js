var soap = require('soap');

var Correios = function(){
    this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
};

Correios.prototype.calcularPrazo = function(entrega, callback){

    soap.createClient(
        this._url,
        function (err, client) {

            if(err){
                console.error('erro no soap', err);
                return;
            }

            client.CalcPrazo(

                {
                    'nCdServico':'40010',
                    'sCepOrigem':entrega.cepOrigem,
                    'sCepDestino':entrega.cepDestino
                },

                callback
            );
        }
    );

};

module.exports = function () {
    return Correios;
};