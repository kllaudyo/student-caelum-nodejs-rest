var fs = require('fs');

fs.readFile('images-of-a-lion-head.jpg',function(error, file){
    console.log('arquivo lido');
    fs.writeFile('lion.jpg', file, function (err) {
        console.log('arquivo criado');
    });
});