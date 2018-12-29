var	fs	=	require('fs');
var Q = require('q');
var	rolodexFile	=	fs.open('My	rollodex	file');
var	rolodex	=	{};


function	retrieve(file,	name)	{
	//	Searches	for	name	in	file,	and	
	//	invokes	cb	with	record	found
}

//var val_rol = Q.denodeify(retrieve);
//var r = val_rol(" denodeify");

//r.then(console.log);

function	processEntry(name)	{
	if	(rolodex[name]) {
		//Provar a vore si es aixona
		var deferred = Q.defer();
		deferred.resolve(retrieve(rolodex[name]));
		return deferred.promise;
	}
	else	{

		var deferred = Q.defer();
		deferred.resolve(retrieve(rolodexFile,	name));
		return deferred.promise;
	}
}

function	test()	{
	for	(var	n	in	testNames)	{
		console.log	('processing	',	n);
		processEntry(n,	function	(res)	{
			console.log('processed	',	n);
		})
	}
}

var	testNames	=	['a',	'b',	'c'];
test();