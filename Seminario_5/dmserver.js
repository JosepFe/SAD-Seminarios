var net = require('net');
var HOST = '127.0.0.1';
var PORT = 9000;

//var dm = require ('./dm.js');

//AÑADIDO MARIA
var zmq = require("zmq");
var pub = zmq.socket("pub");

pub.bind("tcp://*:8000");


var dm = require ('./dm.js');

function Post (msg, from, to, ts) {
	this.msg=msg; this.from=from; this.to=to; this.ts=ts;
}

var sep = "-->";

//FIN AÑADIDO MARIA

// Create the server socket, on client connections, bind event handlers
server = net.createServer(function(sock) {
    
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('Conected: ' + sock.remoteAddress + ':' + sock.remotePort);
    
    
// Add a 'data' event handler to this instance of socket
//MODIFICADO MARIA
    sock.on('data', function(data) {
        
        console.log('request comes in...' + data);
        var str = data.toString();console.log(str.split(sep).slice(0, str.split(sep).length - 1))
        for (peticion of str.split(sep).slice(0, str.split(sep).length - 1)) {
			console.log("Peticion recibida: " + peticion);
			var invo = JSON.parse (peticion);
			console.log('request is:' + invo.what + ':' + str);

			var reply = {what:invo.what, invoId:invo.invoId};
			var broadcast = {what: invo.what};
			switch (invo.what) {
				case 'add user':
					reply.obj = dm.addUser(invo.u, invo.p);
					
					broadcast.exists = reply.obj;
					broadcast.usr = invo.u;
					pub.send(["webserver", JSON.stringify(broadcast)]);
					
					break;
				case 'add subject':
					reply.obj = dm.addSubject(invo.sbj);
					
					broadcast.id = reply.id;
					broadcast.sbj = invo.sbj;
					pub.send(["webserver", JSON.stringify(broadcast)]);
					
					break;
				case 'get subject list': 
					reply.obj = dm.getSubjectList();
					break;
				case 'get user list':
					reply.obj = dm.getUserList();
					break;
				case 'login':
					reply.obj = dm.login(invo.u, invo.p);
					break;
				case 'add private message':
					invo.ts = new Date()
					reply.obj = dm.addPrivateMessage(invo);
					
					broadcast.msg = {msg:invo.msg, from:invo.from, to:invo.to, ts:invo.ts, isPrivate:true};
					pub.send(["webserver", JSON.stringify(broadcast)]);
					
					break;
				case 'get private message list': 
					reply.obj = dm.getPrivateMessageList (invo.u1, invo.u2);
					break;
				case 'get subject':
					reply.obj = dm.getSubject(invo.sbj);
					break;
				case 'add public message':
					invo.msg.ts = new Date()
					reply.obj = dm.addPublicMessage(invo.msg);
					
					broadcast.msg = invo.msg;
					pub.send(["webserver", JSON.stringify(broadcast)]);
					
					break;
				case 'get public message list': 
					reply.obj = dm.getPublicMessageList (invo.sbj);
					break;
			}
			sock.write (JSON.stringify(reply) + sep);
        }
    });
//FIN MODIFICADO MARIA


    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('Connection closed');
    });
    
});
    
server.listen(PORT, HOST, function () {
    console.log('Server listening on ' + HOST +':'+ PORT);
});


