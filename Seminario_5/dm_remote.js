var net = require('net');

var client = new net.Socket();

var sep = "-->";


exports.Start = function (host, port, cb) {
	client.connect(port, host, function() {
    	console.log('Connected to: ' + host + ':' + port);
    	if (cb != null) cb();
	});
}


var callbacks = {} // hash of callbacks. Key is invoId
var invoCounter = 0; // current invocation number is key to access "callbacks".

//
// When data comes from server. It is a reply from our previous request
// extract the reply, find the callback, and call it.
// Its useful to study "exports" functions before studying this one.
//
client.on ('data', function (data) {
	console.log ('data comes in: ' + data);
	var str = data.toString()
	for (peticion of str.split(sep).slice(0, str.split(sep).length - 1)) {
		var reply = JSON.parse (peticion.toString());
		switch (reply.what) {
			// TODO complete list of commands
			case 'get subject list':
			case 'get user list':
			case 'login':
			case 'get private message list':
			case 'get subject':
			case 'get public message list':
				console.log ('We received a reply for: ' + reply.what + ':' + reply.invoId);
				callbacks [reply.invoId] (reply.obj); // call the stored callback, one argument
				delete callbacks [reply.invoId]; // remove from hash
				break;
			
			case 'add user':
			case 'add subject':
				console.log ('We received a reply for add command');
				callbacks [reply.invoId] (); // call the stored callback, no arguments
				delete callbacks [reply.invoId]; // remove from hash
				break;
				
			case 'add private message':
			case 'add public message':
				break;
			
			default:
				console.log ("Panic: we got this: " + reply.what);
		}
	}
});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});


//
// on each invocation we store the command to execute (what) and the invocation Id (invoId)
// InvoId is used to execute the proper callback when reply comes back.
//
function Invo (str, cb) {
	this.what = str;
	this.invoId = ++invoCounter;
	callbacks[invoCounter] = cb;
}

//
//
// Exported functions as 'dm'
//
//
// ADD USER
exports.addUser = function(u, p, cb) {
	var invo = new Invo ('add user', cb);
	invo.u = u
	invo.p = p
	client.write (JSON.stringify(invo) + sep);
}

// ADD SUBJECT
exports.addSubject = function(sbj, cb) {
	var invo = new Invo ('add subject', cb);	
	invo.sbj = sbj;
	client.write (JSON.stringify(invo) + sep);
}

// GET SUBJECT LIST
exports.getSubjectList = function (cb) {
	var invo = new Invo ('get subject list', cb);
	client.write (JSON.stringify(invo) + sep);
}

// GET USER LIST
exports.getUserList = function (cb) {
	var invo = new Invo ('get user list', cb);
	client.write (JSON.stringify(invo) + sep);
}

// LOGIN
exports.login = function(u, p, cb) {
	var invo = new Invo ('login', cb);
	invo.u = u
	invo.p = p
	client.write (JSON.stringify(invo) + sep);
}

// ADD PRIVATE MESSAGE
exports.addPrivateMessage = function(data, cb) {
	var invo = new Invo ('add private message', cb);
	invo.to = data.to
	invo.from = data.from
	invo.msg = data.msg;
	client.write (JSON.stringify(invo) + sep);
}

// GET PRIVATE MESSAGE LIST
exports.getPrivateMessageList = function (u1, u2, cb) {
	invo = new Invo ('get private message list', cb);
	invo.u1 = u1;
	invo.u2 = u2;
	client.write (JSON.stringify(invo) + sep);
}

// GET SUBJECT
exports.getSubject = function  (sbj, cb) {
	var invo = new Invo ('get subject', cb);
	invo.sbj = sbj;
	client.write (JSON.stringify(invo) + sep);
}

// ADD PUBLIC MESSAGE
exports.addPublicMessage = function(msg, cb) {
	console.log(msg)
	var invo = new Invo ('add public message', cb);	
	invo.msg = msg;
	client.write (JSON.stringify(invo) + sep);
}

// GET PUBLIC MESSAGE LIST
exports.getPublicMessageList = function  (sbj, cb) {
	var invo = new Invo ('get public message list', cb);	
	invo.sbj = sbj;
	client.write (JSON.stringify(invo) + sep);
}





