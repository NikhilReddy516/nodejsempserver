var Employee = function(empName, deptId, salary, job, doj){

	this.empName = empName;
	this.deptId = deptId;
	this.salary = salary;
	this.job = job;
	this.doj = doj;

};

var employees = require("./../../src/models/employees");
var dbHelper = require("./../../src/models/databaseHelper");

var request = require("request");




describe("Employee test server test cases ", function() {

    var employeesUrl = "http://localhost:3001/employees";

    var empId1, empId2, empId3, empId4;

    it("should setup the database table", function(done) {
        var connection = dbHelper.getConnection();
        expect(connection).not.toBe(null);
        employees.setupEmployeesTable(function(err, result) {
            expect(err).toBe(null);
            dbHelper.endConnection();
            done();
        });
    });

    it("should create employee Nikhil", function(done) {
        var self = this;
        var employee = [new Employee( "Nikhil", 10, 2000, 'Assistant', '2000-12-03')];
        request.post({
                url: employeesUrl,
                body: employee,
                json: true
            },
            function(error, response, body) {
                try {
                    expect(response.statusCode).toBe(201);
                    empId1 = "" + body;
                    done();
                } catch (e) {
                    self.fail(Error(e));
                    done();
                }
            });
    });

    	it("should get all the employees ", function(done) {
        var self = this;
        request.get({
                url: employeesUrl,
                json: true
            },
            function(error, response, body) {
                try {
                    expect(response.statusCode).toBe(200);
                    expect(body.length).toBe(1);
				var empId = body[0].empId;
                    expect(typeof(empId)).toBe("number");
                    done();
                } catch (e) {
                    self.fail(Error(e));
                    done();
                }
            });
    });

    it("should create employee", function(done) {
	   var self = this;
	   var employees = [];
	   employees.push(new Employee( "Pranav", 20, 1000, 'Manager', '2001-12-12'));
	   employees.push(new Employee( "Rahul", 10, 5000, 'Clerk', '2005-11-20'));
	   employees.push(new Employee( "Akhil", 10, 8500, 'Assistant', '2003-01-16'));
	   employees.push(new Employee( "Anil", 20, 9000, 'Developer', '2007-03-18'));
	   employees.push(new Employee( "Prashanth", 10, 20000, 'Advisor', '2000-05-24'));

	   request.post({
			 url: employeesUrl,
			 body: employees,
			 json: true
		  },
		  function(error, response, body) {
			 try {
				expect(response.statusCode).toBe(201);
				empId2 = "" + body;
				done();
			 } catch (e) {
				self.fail(Error(e));
				done();
			 }
		  });
    });

    it("should retrieve Employee Nikhil", function(done) {
        var self = this;
        request.get({
                url: employeesUrl + "/" + empId1,
                json: true
            },
            function(error, response, body) {
                try {
                    expect(response.statusCode).toBe(200);
                    expect(body.empName).toBe("Nikhil");
                    done();
                } catch (e) {
                    self.fail(Error(e));
                    done();
                }
            });
    	});

	it("should get all the employees whose salary greater than 5000", function(done) {
        var self = this;
        request.get({
                url: employeesUrl+"/?salary=5000&&operator=>",
                json: true
            },
            function(error, response, body) {
                try {
                    expect(response.statusCode).toBe(200);
                    expect(body.length).toBe(3);
                    done();
                } catch (e) {
                    self.fail(Error(e));
                    done();
                }
            });
    });


    	it("should get all the employees whose name is Anil", function(done) {
	  	var self = this;
	  	request.get({
			url: employeesUrl+"/?empName=Anil",
			json: true
		},
		function(error, response, body) {
			try {
			    expect(response.statusCode).toBe(200);
			    expect(body.length).toBe(1);
			    expect(body[0].job).toBe("Developer");
			    done();
			} catch (e) {
			    self.fail(Error(e));
			    done();
			}
		});
   	});


    	it("should get all the employees whose name is starts with P ", function(done) {
	  	var self = this;
	  	request.get({
			url: employeesUrl+"/?empName=P%",
			json: true
		},
		function(error, response, body) {
			try {
			    expect(response.statusCode).toBe(200);
			    expect(body.length).toBe(2);
			    done();
			} catch (e) {
			    self.fail(Error(e));
			    done();
			}
		});
   	});


    	it("should update all the employees whose deptId is 10 and salary < 8000 ", function(done) {
	  	var self = this;
	  	request.put({
			url: employeesUrl+"/?deptId=10&&salary=8000&&operator=<",
			body : {salary:'`salary`+5000', job:'Clerk'},
			json: true
		},
		function(error, response, body) {
			try {
			    expect(response.statusCode).toBe(200);
			    expect(body.affectedRows).toBe(2);
			    expect(body.changedRows).toBe(1);
			    done();
			} catch (e) {
			    self.fail(Error(e));
			    done();
			}
		});
   	});

});
