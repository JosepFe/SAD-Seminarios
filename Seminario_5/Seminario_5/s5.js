var zmq = require('zmq');
var rp = zmq.socket('rep');
var rp2 = zmq.socket('rep');

rp.bind('tcp://127.0.0.1:8001',
 function(err) {
 if (err) throw err;
 });

 rp2.bind('tcp://127.0.0.1:8002',
 function(err) {
 if (err) throw err;
 });

var srv = [];
var allsrv = [];


rp.on('message', function(msg) {

 console.log('Nuevo componente: ' + msg);
 allsrv.push(JSON.parse(msg));
 rp.send('OK');

});

rp2.on('message', function (data){
	srv = [];
	console.log('Servicio demandado: ' + data);

	for (var i = 0; i< allsrv.length; i++){
		if(allsrv[i].srv == data) {
			srv.push(allsrv[i]);
		}
	}
	console.log(srv);
	rp2.send(JSON.stringify(srv));
});