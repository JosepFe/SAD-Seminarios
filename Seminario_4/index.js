var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

var peopleOnline = [];
var peopleTyping = [];

io.on("connection", function(socket) {
  var personName;
  console.log("a user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");

    var index = peopleOnline.indexOf(personName);
    if (index > -1) {
      peopleOnline.splice(index, 1);
    }
    io.emit('user list', peopleOnline);
    socket.emit('stop typing', personName);
    socket.broadcast.emit("chat message", "Se ha desconectado " + personName);
  });

  socket.on("chat message", function(msg) {
    console.log("message: " + personName + ": " + msg);
    io.emit("chat message", personName + ": " + msg);
  });

  socket.on("escribiendo", function(person) {
    if (!peopleTyping.includes(person)) {
      socket.broadcast.emit("typing", person + " is typing");
      peopleTyping.push(person);
    }
  });

  socket.on('ha dejado de escribir', function(person){
    var index = peopleTyping.indexOf(person);
    if (index > -1) {
      peopleTyping.splice(index, 1);
      io.emit("stop typing", person);
    }
  });

  socket.on("nombre persona", function(person) {
    peopleOnline.push(person);
    console.log(person);
    personName = person;
    socket.broadcast.emit("chat message", "Se ha conectado " + person);
    io.emit('user list', peopleOnline);
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
