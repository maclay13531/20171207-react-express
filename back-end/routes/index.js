var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var config = require('../config/config');
var connection = mysql.createConnection(config)
connection.connect();

/* GET home page. */
router.get('/getStudents', function(req, res, next) {
	const selectQuery = `SELECT * FROM students`;
	connection.query(selectQuery,(error, results)=>{
		if (error){
			throw error;
		}else{
			res.json(results);		
		}
	})	
});

router.post('/addStudent',(req, res)=>{
	// this data is posted from axios in react (app.js)
	const studentName = req.body.studentName;
	var insertQuery = `INSERT INTO students 
		(name)
		VALUES
		(?)`
	var promiseOne = new Promise((resolve, reject)=>{
		connection.query(insertQuery,[studentName],(error)=>{
			if(error){
				reject(error);
			}else{
				resolve({
					msg: "success"
				});
			}
		})

	});
	promiseOne.then((data)=>{
		var promiseTwo = new Promise((resolve, reject)=>{
			const query = `SELECT * FROM students;`;
			connection.query(query,(error, results)=>{
				if(error){
					reject(error);
				}else{
					resolve(results);
				}
			})	
		})
		promiseTwo.then((studentsList)=>{
			res.json(studentsList);
		})
	})

	// res.json(req.body);
})


module.exports = router;
