const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { response } = require('express');
const { request } = require('http');


const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '10272000',
	database : 'cs425project'
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login/login.html'));
});

app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.redirect('/registerpage')
			}			
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		return response.sendFile(path.join(__dirname + "/home/home.html"))
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

app.get('/home/showproducts', function(request,response){
	var sql = 'SELECT * FROM products';
	response.sendFile(__dirname+"/home/home.html")
	connection.query(sql,function(err,res){
		if (err) throw err;
		response.send(res)
		for(let i =0; i < res.length; i++){
			console.log(res[i]['product_name'])
		}
	})
	return
})

app.get('/registerpage', function(req,res){
	res.sendFile(__dirname + "/login/register.html")
})

app.post('/register', function(req,res){
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email
	if (username && password && email){
		connection.query('INSERT INTO accounts (username, password, email) VALUES (?,?,?)',[username,password,email]);
		req.session.loggedin=true;
		res.redirect('/home')

	}else{res.send('Please enter username, password and e-mail address!')}
})


app.listen(3000);
