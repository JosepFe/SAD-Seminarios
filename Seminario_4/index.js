var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  
  var personName;
  
  var peopleTyping = [];
  var peopleOnline = [];

  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
    if(personName == ""){
      socket.broadcast.emit('chat message','Se ha desconectado un usuario');
    } else {
      var index = peopleOnline.indexOf(personName);
      if (index > -1) {
        peopleOnline.splice(index, 1);
     }
      socket.broadcast.emit('chat message','Se ha desconectado ' + personName);
    }
  });

  socket.on('chat message', function(msg){
    if(personName == "" || personName == null){
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    } else {
      var index = peopleTyping.indexOf(personName);
      if (index > -1) {
        peopleTyping.splice(index, 1);
        io.emit('stop typing', personName);
     }
      console.log('message: ' + personName + ": " + msg);
      io.emit('chat message', personName + ": " + msg);
    }
  });

  socket.on('escribiendo', function(person){
    if(person != "" && personName != null && !peopleTyping.includes(person)){
      socket.broadcast.emit('typing', person + ' is typing')
      peopleTyping.push(person);
    }
  });

  socket.on('nombre persona', function(person){
    peopleOnline.push(person);
    console.log(person);
    personName = person;
    if(person == "" || personName == null){
      socket.broadcast.emit('chat message','Se ha conectado un nuevo usuario');
    }else{
      socket.broadcast.emit('chat message','Se ha conectado ' + person);
    }
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
