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
	return response.sendFile(path.join(__dirname + '/login/login.html'));
});

//route to authenticate users
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
				request.session.cartID = request.sessionID
				// Redirect to home page
				return response.redirect('/home');
			} else {
				return response.redirect('/registerpage')
			}			
		});
	} else {
		return response.send('Please enter Username and Password!');
		response.end();
	}
});

//user login page
app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		request.session.cartID = request.session.username
		return response.sendFile(path.join(__dirname + "/home/home.html"))
	} else {
		// Not logged in
		request.session.cartID = request.sessionID
		return response.sendFile(path.join(__dirname + "/home/home.html"))
	}
	response.end();
});

//route to return the products in table 
app.get('/getproducts', function(request,response){
	var sql = 'SELECT * FROM products';
	connection.query(sql,function(err,res){
		if (err) {throw err;}
		for(let i =0; i < res.length; i++){
			console.log(res[i]['product_name'])
		}
		return response.send(res)
	})
})

//send user to registration page
app.get('/registerpage', function(req,res){
	return res.sendFile(__dirname + "/login/register.html")
})

app.post('/register', function(req,res){
	let username = req.body.username;
	let password = req.body.password;
	let email = req.body.email
	if (username && password && email){
		connection.query('INSERT INTO accounts (username, password, email) VALUES (?,?,?)',[username,password,email]);
		req.session.loggedin=true;
		return res.redirect('/home')

	}else{return res.send('Please enter username, password and e-mail address!')}
})

//route to add items to user's cart
app.post('/addToCart', function(request,response){
	console.log(request.body['product_id'])
	//if user logged in, make the card ID the username + the sessionID, elsewise make the cartID the sessionID
	if(request.session.loggedin){
		var cartID = request.session.username.toString() + request.sessionID.toString()
	}else{
		var cartID = request.sessionID.toString()
	}
	var c = 0
	var cust_id
	var productID = request.body["product_id"]
	if(request.session.username){
		connection.query('SELECT customer_id FROM accounts WHERE username = ?',[request.session.username.toString()], function(err,res){
			if(err) {throw err;}
			if(res.length > 1){
				cust_id = res[0]['customer_id']
			}
		})
	}
	//check to see if the cartID is already in the cart table, and if it is we will do nothing. If it isn't then we must create a new table entry
	connection.query('SELECT cart_id FROM cart', function (err, res) {
		if (err) { throw err; }
		for (let i = 0; i < res.length; i++) {
			if (res[i]['cart_id'] == cartID) {
				c = c + 1;
			}
		}
		if(c==0){
			connection.query('INSERT INTO cart (cart_id, customer_id) VALUES(?,?)',[cartID,cust_id])
		}
		connection.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?,?,?)',[cartID,productID,1])
	})
	return response.end()
})

app.listen(3000);
