
var cluster = require('cluster');
var os = require('os');
var cpus = os.cpus();

if(cluster.isMaster){
    console.log('thread master');
    cpus.forEach(function(cpu){
        cluster.fork();
    });
}else if(cluster.isWorker){
    console.log('thread work');
    require('./index.js');
}
