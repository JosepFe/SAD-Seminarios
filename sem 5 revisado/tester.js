var zmq = require('zmq');
var rq = zmq.socket('req');


rq.connect('tcp://127.0.0.1:8888');

var nodo = new Object();
nodo.what = 'componente';
nodo.srv = 'http';

rq.send(JSON.stringify(nodo));


rq.on('message', function(msg) {
 console.log('Confirmacion: ' + msg);
});

rq.send(request,'http');

rp.on('request', function (data){
	console.log('componentes con los servicios demandados: ' + data);
});