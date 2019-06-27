var express = require('express');
var app = express();

var employees = require('./routes/employees');


app.use('/employees', employees);

app.all('/*', function(req, res){
	console.log("Error in requested url");
	res.writeHead(400, {'Content-Type' : 'text/plain'});
	res.end();
	return;
});


var server = app.listen(3001, function(){
	var port = server.address().port;
	console.log("Server is listening on port "+port);
});
