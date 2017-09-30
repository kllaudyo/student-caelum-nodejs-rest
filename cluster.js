var cluster = require('cluster');
if(cluster.isMaster){
    console.log('executando thread master');
    //gerando nova thread filha da thread principal
    //essa thread de trabalho só pode ser criada apartir
    //da thread principal
    cluster.fork(); //executa o mesmo arquivo novamente na thread de trabalho
}else if(cluster.isWorker){
    console.log('executando thread slave');
}

