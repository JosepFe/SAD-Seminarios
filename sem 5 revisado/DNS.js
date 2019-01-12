var zmq = require('zmq');
var rp = zmq.socket('rep');


rp.bind('tcp://127.0.0.1:8001',
 function(err) {
 if (err) throw err;
 });

var srv = [];
var allsrv = [];


rp.on('message', function(msg) {

 console.log('Nuevo componente: ' + msg);
 allsrv.push(JSON.parse(msg));
 rp.send(srv);

});

rp.on('request', function (data){

	console.log('Servicio demandado: ' + data);

	for (var i = 0; i< allsrv.length(); i++){
		if(allsrv[i].srv == data) {
			srv.push(allsrv[i]);
		}
	}

	rp.send(request, srv);
	srv = [];
});