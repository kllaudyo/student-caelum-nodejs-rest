var fs = require('fs');

fs.createReadStream('lion.jpg')
    .pipe(fs.createWriteStream('lion-stream.jpg'))
    .on('finish',function(){
        console.log('imagem criada com stream');
    });