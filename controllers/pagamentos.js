
module.exports = function(app){
    app.get('/pagamentos',function(request, response){
        console.log('recebendo requisicao para /pagamentos');
        response.end('OK');
    });
};