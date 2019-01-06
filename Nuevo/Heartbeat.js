const socket = require("zmq").socket("pub"); // PUB socket
const rep = require("zmq").socket("rep"); // PUB socket

rep.bindSync("tcp://127.0.0.1:3001");
socket.bindSync("tcp://127.0.0.1:3000");

const topic = "heartbeat";

var listWorkers = [];
var newListWorkers = [];

setInterval(function() {
  const timestamp = Date.now().toString();
  socket.send([topic, timestamp]); // Publish timestamp
}, 4000);

rep.on("message", function(data) {
  //console.log(data.toString());
  rep.send("message", "ACK");
  if (!listWorkers.includes(data.toString())) {
    newListWorkers.push(data.toString());
    //console.log(listWorkers);
  }
});

setInterval(function() {
    listWorkers = newListWorkers;
    console.log(listWorkers);
  }, 3000);
