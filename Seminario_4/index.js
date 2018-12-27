var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

var peopleOnline = [];
var peopleTyping = [];
var users = [];

io.on("connection", function(socket) {
  var personName;
  console.log("a user connected with id" + socket.id);

  socket.on("disconnect", function() {
    console.log("user disconnected");

    var index = peopleOnline.indexOf(personName);
    if (index > -1) {
      peopleOnline.splice(index, 1);
    }
    io.emit("user list", peopleOnline);
    socket.emit("stop typing", personName);
    socket.broadcast.emit("chat message", "Se ha desconectado " + personName);
  });

  socket.on("chat message", function(msg) {
    if (msg.charAt(0) == "%") {

      var aux = msg.split("%");
      var nameTo = aux[1];
      var message = aux[2];
      var idTo = "";

      users.forEach(user => {
        if (user[0] == nameTo) {
          idTo = user[1];
        }
      });
      console.log(
        "el mensaje de " + personName + " para " + nameTo + " es : " + message
      );

      socket.to(idTo).emit("chat message", personName + ":" + message);
    } else {
      console.log("el mensaje publico de " + personName + " es : " + message);
      io.emit("chat message", personName + ": " + msg);
    }
  });

  socket.on("escribiendo", function(person) {
    if (!peopleTyping.includes(person)) {
      socket.broadcast.emit("typing", person + " is typing");
      peopleTyping.push(person);
    }
  });

  socket.on("ha dejado de escribir", function(person) {
    var index = peopleTyping.indexOf(person);
    if (index > -1) {
      peopleTyping.splice(index, 1);
      io.emit("stop typing", person);
    }
  });

  socket.on("nombre persona", function(person) {
    var persona = [person, socket.id];
    users.push(persona);
    peopleOnline.push(person);
    console.log(users);
    personName = person;
    socket.broadcast.emit("chat message", "Se ha conectado " + person);
    io.emit("user list", peopleOnline);
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});
