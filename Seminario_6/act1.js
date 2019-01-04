var	fs = require('fs');
var Q = require('q');

var rolodexFile = fs.open('My rollodex file', 'w', function (err, file) {
	if (err) throw err;
  });

var	rolodex	= {};


function	retrieve(file,	name)	{
	//	Searches	for	name	in	file,	and	
	//	invokes	cb	with	record	found
}


function	processEntry(name)	{
	if	(rolodex[name]) {
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
	testNames.forEach(function(element){
		console.log	('processing	',	element);
		processEntry(element).then(function(x){
			console.log('processed	',	element);
		});
	});
}


var	testNames	=	['a',	'b',	'c'];
test();