var express = require('express');
var router = express.Router();
var employees = require('./../models/employees');


router.get('/:empId', function(req, res){

	console.log("Entered get/:empId");
	var empId = req.params.empId;
	console.log(parseInt(empId));
	if(isNaN(parseInt(empId))){
		res.writeHead(400, {"Content-Type" : "text/plain"});
		res.end();
		return;
	}
	empId = parseInt(empId);
	console.log("In get/:empId ", empId);
	employees.getEmployee(empId, function(err, resultSet){

		if(err){
			console.log("Error in get/:EmpId ", req.params.empId, err);
			res.writeHead(400, {"Content-Type" : "text/plain"});
			res.end();
			return;
		}

		if(resultSet.affectedRows == 0){
			console.log("No record found for id ", empId);
			res.writeHead(404, {"Content-Type" : "text/plain"});
			res.end();
			return;
		}

		res.writeHead(200, {"Content-Type" : "text/plain"});
		res.end(JSON.stringify(resultSet[0]));
		return;
	});

});


router.get('/', function(req, res){

	console.log("Query params in get/ ", req.query);

	employees.getEmployees(req.query, function(err, resultSet){

		if(err){
			console.log("Error in get/ ", err);
			res.writeHead(400, {"Content-Type" : "text/plain"});
			res.end();
			return;
		}
	//	console.log("ResultSet for get/ is ", resultSet);
		res.writeHead(200, {"Content-Type" : "text/plain"});
		res.end(JSON.stringify(resultSet));
		return;
	});

});


var JSONObjToArr = function(newEmployees){

	var JSONArr = new Array();
	var len = newEmployees.length;

	for(var index = 0; index<len; index++){
		var obj = [];
		var keys = ["empName", 'deptId', 'salary', 'job', 'doj'];
		for(key in keys){
			key = keys[key];
			obj.push(newEmployees[index][key]);
		}
		JSONArr.push(obj);

	}
	return JSONArr;

};


router.post('/', function(req, res){

	var newEmployees = "";
	req.on('data', function(chunck){
		newEmployees += chunck;
	});

	req.on('end', function(){

		if(newEmployees.length < 3){
			res.writeHead(400, {"Content-Type" : "text/plain"});
			res.end();
			return;
		}

		newEmployees = JSON.parse(newEmployees);
		console.log("New Employee after parsing", newEmployees);
		newEmployees = JSONObjToArr(newEmployees);
		console.log("New Employees after converting to array ", newEmployees);

		employees.addEmployees(newEmployees, function(err, resultSet){

			if(err){
				console.log("Error in adding Employee", err);
				res.writeHead(400, {"Content-Type" : "text/plain"});
				res.end();
				return;
			}

		//	console.log("Employee got added", newEmployees);
			res.writeHead(201, {"Content-Type" : "text/plain"});
			res.end(JSON.stringify(resultSet.insertId));
			return;
		});

	});

});

router.put('/', function(req, res){


	var updateDetails = "";
	req.on('data', function(chunck){
		updateDetails += chunck;
	});

	req.on('end', function(){

		if(updateDetails.length <= 2){
			res.writeHead(400, {"Content-Type" : "text/plain"});
			res.end();
			return;
		}

		updateDetails = JSON.parse(updateDetails);
		console.log("Update Details are ", updateDetails);
		employees.updateEmployees(updateDetails, req.query, function(err, resultSet){

			if(err){
				console.log("Err in put/ ", err, updateDetails);
				res.writeHead(400, {"Content-Type" : "text/plain"});
				res.end();
				return;
			}

			res.writeHead(200, {"Content-Type" : "text/plain"});
			res.end(JSON.stringify(resultSet));
			return;
		});

	});

});


module.exports = router;
