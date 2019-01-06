const socket = require("zmq").socket("pub"); // PUB socket
const rep = require("zmq").socket("rep"); // PUB socket

rep.bindSync("tcp://127.0.0.1:3001");
socket.bindSync("tcp://127.0.0.1:3000");

const topic = "heartbeat";

var listWorkers = [];
var auxListWorkers = [];

setInterval(function() {
  const timestamp = Date.now().toString();
  socket.send([topic, timestamp]); // Publish timestamp
}, 300);

rep.on("message", function(data) {
  //console.log(data.toString());
  rep.send("message", "ACK");
  if (!auxListWorkers.includes(data.toString())) {
    auxListWorkers.push(data.toString());
  }
});

setInterval(function() {
  listWorkers = newListWorkers;
  newListWorkers = [];
  console.log(listWorkers);
}, 400);
