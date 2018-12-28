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

  socket.on("disconnect", function() {
    if (personName != undefined) {
      var peopleOnlineIndex = peopleOnline.indexOf(personName);
      if (peopleOnlineIndex > -1) {
        peopleOnline.splice(peopleOnlineIndex, 1);
      }

      var usersIndex = findIndexWithAttr(
        users,
        "name",
        personName.toLowerCase()
      );
      if (usersIndex > -1) {
        users.splice(usersIndex, 1);
      }

      console.log(
        "usuarios conectados al desconectarse " +
          personName +
          ": " +
          JSON.stringify(users)
      );
      io.emit("lista usuarios", "Usuarios online: " + peopleOnline);
      socket.emit("fin escribiendo", personName);
      socket.broadcast.emit("chat mensaje", "Se ha desconectado " + personName);
    }
  });

  socket.on("chat mensaje", function(msg) {
    if (msg.charAt(0) == "%") {
      var aux = msg.split("%");
      var nameTo = aux[1].toLowerCase();
      var message = aux[2];
      var idTo = "";

      var id = users.forEach(user => {
        if (user.name == nameTo) {
          idTo = user.id;
        }
      });
      console.log(
        "El mensaje de " + personName + " para " + nameTo + " es : " + message
      );

      socket.to(idTo).emit("chat mensaje", personName + ":" + message);
    } else {
      console.log("El mensaje publico de " + personName + " es : " + msg);
      io.emit("chat mensaje", personName + ": " + msg);
    }
  });

  socket.on("escribiendo", function(person) {
    if (!peopleTyping.includes(person)) {
      socket.broadcast.emit("escribiendo", person + " esta escribiendo");
      peopleTyping.push(person);
    }
  });

  socket.on("ha dejado de escribir", function(person) {
    var index = peopleTyping.indexOf(person);
    if (index > -1) {
      peopleTyping.splice(index, 1);
      io.emit("fin escribiendo", person);
    }
  });

  socket.on("usuario conectado", function(person) {
    var existeUsuario = users.find(user => user.name == person.toLowerCase());

    if (existeUsuario != null || existeUsuario != undefined) {
      socket.emit("usuario repetido");
    } else {
      var persona = new Object();
      persona.name = person.toLowerCase();
      persona.id = socket.id;

      users.push(persona);
      peopleOnline.push(person);

      console.log(
        "usuarios conectados al conectarse " +
          person +
          ": " +
          JSON.stringify(users)
      );

      personName = person;

      socket.broadcast.emit("chat mensaje", "Se ha conectado " + person);
      io.emit("lista usuarios", "Usuarios online: " + peopleOnline);
    }
  });
});

http.listen(3000, function() {
  console.log("listening on *:3000");
});

function findIndexWithAttr(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}
