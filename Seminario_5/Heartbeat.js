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
  rep.send("message", "ACK");
  if (!auxListWorkers.includes(JSON.parse(data))) {
    auxListWorkers.push(JSON.parse(data));
  }
});

setInterval(function() {
  listWorkers.forEach(function(element1){
    var b = JSON.parse(element1);

    //buscar alternativa con encontrar diferencuia entre dos arrays(de objetos json)
    auxListWorkers.forEach(function(element2){
      var e = JSON.parse(element2);
      if(!b.name == e.name){
        console.log("holaaa")
      }
    });

    //mirar quien tiene una tarea == "";
    //notificar al worker con tarea vacia que tiene que hacer la nueva tarea
  });

  listWorkers = auxListWorkers;
  auxListWorkers = [];
  console.log(listWorkers);
}, 400);
