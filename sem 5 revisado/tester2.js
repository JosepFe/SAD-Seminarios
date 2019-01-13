var zmq = require('zmq');
var rq = zmq.socket('req');
var rq2 = zmq.socket('req');


rq.connect('tcp://127.0.0.1:8001');
rq2.connect('tcp://127.0.0.1:8002');

var nodo = new Object();
nodo.what = 'componente';
nodo.srv = 'hola';
nodo.ip = '127.0.0.1:9002';

rq.send(JSON.stringify(nodo));


rq.on('message', function(msg) {
 console.log('Confirmacion: ' + msg);
});

rq2.send('hola');

rq2.on('message', function (data){
	console.log('componentes con los servicios demandados: ' + data);
});