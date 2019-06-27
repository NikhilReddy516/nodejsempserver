var mysql = require('mysql');


var theConnection = null;

var theDbConfig = {
	host : "localhost",
	user : "root",
	password : "root",
	database : "employeeserver",
	port : 3306
}


exports.getConnection = function(){

	theConnection = mysql.createConnection(theDbConfig);
	return theConnection;

};

exports.endConnection = function(){

	if(theConnection != null) {
   	 theConnection.end();
     }
     theConnection = null;
};
