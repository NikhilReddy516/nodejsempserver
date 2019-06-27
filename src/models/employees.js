var DBHelper = require('./databaseHelper');


var queryBuilder = function(queryParams){

	var queryString = 'where ';

	var keys = Object.keys(queryParams);
	var len = keys.length;

	for(var index =0; index<len; index++){
		var key = keys[index];
		if(key == 'empName' || key == 'job'){

			if(index == 0)
				queryString  = queryString + key+' LIKE \''+queryParams[key]+'\'';
			else
				queryString = queryString+' AND '+key+' LIKE \''+queryParams[key]+'\'';

		}
		else if(key == 'salary'){
			var operator = ' = ';

			if(index+1 < len && keys[index+1] == 'operator'){
				operator = queryParams.operator;
			}


			if(index == 0)
				queryString = queryString+key+operator+queryParams[key];

			else
				queryString = queryString+' AND '+key+operator+queryParams[key];

			if(operator != ' = ')
				index++;

		}
		else{
			if(index == 0)
				queryString = queryString+key+' = '+queryParams[key];
			else
				queryString = queryString+' AND '+key+' = '+queryParams[key];
		}

	}

	return queryString;
}





exports.getEmployee = function(empId, callback){

	var connection = DBHelper.getConnection();

	var sqlQuery = "select * from employees where empId = "+empId;

	console.log("Sql query going to exeucte in getEmp is ", sqlQuery);
	connection.query(sqlQuery, function(err, resultSet){

		if(err){
			console.log("Error in get/empId Query execution ", err);
			callback(err);
			return;
		}
		console.log("Result in getEmp", resultSet);
		DBHelper.endConnection();
		callback(null, resultSet);
		return;

	});

};


exports.getEmployees = function(queryParams, callback){


	var sqlQuery = 'select * from employees ';

	if(queryParams != null && Object.keys(queryParams).length != 0)
		sqlQuery = sqlQuery+queryBuilder(queryParams);

	var connection = DBHelper.getConnection();

	console.log("Sql Query going to execute in getEmployees ", sqlQuery);
	connection.query(sqlQuery, function(err, resultSet){

		if(err){
			console.log("Error in getEmployees ", err);
			callback(err);
			return;
		}

		console.log("Result set in getEmployees", resultSet);
		DBHelper.endConnection();
		callback(null, resultSet);
		return;
	});


};

exports.addEmployees = function(newEmployees, callback){
	var connection = DBHelper.getConnection();
	var len = newEmployees.length;

	var sqlQuery = 'insert into employees (empName, deptId, salary, job, doj) VALUES ?';

	console.log("SQl Query going to execute for insert is ", connection.format(sqlQuery, newEmployees));

	connection.query(sqlQuery+';', [newEmployees], function(err, resultSet){
		if(err){
			console.log("Error in insertion Query ", sqlQuery , err);
			callback(err);
			return;
		}
		console.log("Result Set after insertion is ", resultSet);
		DBHelper.endConnection();
		callback(null, resultSet);
		return;
	});
};


exports.updateEmployees = function(updateDetails, queryParams, callback){

	var connection = DBHelper.getConnection();

	var sqlQuery = "update employees set ? "+queryBuilder(queryParams);

	connection.query(sqlQuery, [updateDetails], function(err, resultSet){

		if(err){
			console.log("Err in udpateEmployees ", connection.format(sqlQuery,[updateDetails]), err);
			callback(err);
			return;
		}

		console.log("Result set in updateEmployees is", resultSet);
		callback(null, resultSet);
		return;
	});
};

exports.setupEmployeesTable = function(callback){

	var connection = DBHelper.getConnection();

	connection.query("drop table employees;", function(err, resultSet){

		var sqlQuery = 'create table employees (empId int(4) NOT NULL PRIMARY KEY AUTO_INCREMENT, empName varchar(20) NOT NULL, deptId int(4) NOT NULL, salary decimal(7,2) NOT NULL, job varchar(20) NOT NULL, doj date NOT NULL) AUTO_INCREMENT=1000;';
		connection.query(sqlQuery, function(err, resultSet){
			if(err){
				console.log("Err in table creation",err);
				callback(err);
				return;
			}

			DBHelper.endConnection();
			console.log("Table created successfully");
			callback(null);
			return;
		});

	});
};
