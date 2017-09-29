var fs = require('fs');

module.exports = function(app){

    app.post('/upload/imagem',function(request, response){

        console.log(request.headers.filename);

        request
            .pipe(fs.createWriteStream('files/' +  request.headers.filename))
            .on('finish', function(){
                response.status(201).location('files/' +  request.headers.filename).send('');
            });

    })

};