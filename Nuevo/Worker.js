var zmq = require("zmq");
var socket = zmq.socket("sub");
var req = zmq.socket("req");

req.connect("tcp://127.0.0.1:3001");
socket.connect("tcp://127.0.0.1:3000"); // Connect to port 3000

socket.subscribe("heartbeat"); // Subscribe to 'heartbeat'

var name = process.argv[2];

socket.on("message", function(topic, msg) {
  console.log("Received: " + msg + " for " + topic);
  req.send(name);
});

//socket.send();
