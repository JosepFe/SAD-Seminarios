var dm = require ('./dm_remote.js');

var HOST = '127.0.0.1';
var PORT = 10000;


dm.Start(HOST, PORT, function () {
	switch(process.argv[2]){
		case "ADD_USER":
			// ADD USER
			dm.addUser("Foreador", "perez", function (msg) {
				console.log("Usuario registrado correctamente");
				console.log(msg);
			});
			break;

		case "ADD_SUBJECT":
			// ADD SUBJECT
			dm.addSubject("Navidad", function(idlen) {
				console.log("Tema registrado correctamente");
				console.log(idlen);
			});
			break;

		case "GET_SUBJECT_LIST":
			// GET SUBJECT LIST
			dm.getSubjectList(function (ml) {
				mlp = JSON.parse(ml)
				
				console.log ("Aquí:");
				console.log (mlp);
			});
			break;

		case "GET_USER_LIST":
			// GET USER LIST
			dm.getUserList(function(rep) {
				console.log(rep);
			});
			break;

		case "LOGIN":
			// LOGIN
			dm.login("Foreador", "12345	", function(success) {
				console.log("Login correcto? " + success.toString());
			});
			break;

		case "ADD_PRIVATE_MESSAGE":
			// ADD PRIVATE MESSAGE
			dm.addPrivateMessage("Foreador", "regalos", "Soy un mensaje privado", function() {
				console.log("Mensaje privado enviado");
			});
			break;

		case "GET_PRIVATE_MESSAGE_LIST":
			// GET PRIVATE MESSAGE LIST
			dm.getPrivateMessageList("Foreador","regalos", function (resp) {
				console.log(resp)
			});
			break;

		case "GET_SUBJECT":
			// GET SUBJECT
			dm.getSubject("Literatura", function(rep) {
				console.log("Tema: " + rep.toString());
			});
			break;

		case "ADD_PUBLIC_MESSAGE":
			// ADD PUBLIC MESSAGE
			dm.addPublicMessage({"msg":"Mensaje publico", "from":"mudito", "to":"id1", "ts":new Date()}, function() {
				console.log("Mensaje publico enviado");
			});
			break;

		case "GET_PUBLIC_MESSAGE_LIST":
			// GET PUBLIC MESSAGE LIST
			dm.getPublicMessageList("id1", function(pml) {
				console.log("Message list from " + "id1");
				console.log ("Aquí:");
				console.log (pml);
			});
			break;
		
		default:
			console.log("ERROR, recibido: " + process.argv[2]);
	}
	
	dm.Close();
});

