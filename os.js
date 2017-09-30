
var cluster = require('cluster');
var os = require('os');
var cpus = os.cpus();

if(cluster.isMaster){
    console.log('thread master');
    cpus.forEach(function(cpu){
        cluster.fork();
    });

    //capturando o pid de cada listener
    cluster.on('listening',function(worker){
        console.log('cluster pid: ' + worker.process.pid);
    });

    //se um processo morrer, ele cria o processo novamente
    cluster.on('exit', worker => {
        console.log('cluster %d desconectado',worker.process.pid);
        cluster.fork();
    });

}else if(cluster.isWorker){
    console.log('thread work');
    require('./index.js');
}
