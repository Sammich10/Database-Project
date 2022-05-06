const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { response } = require('express');
const { request } = require('http');
const e = require('express');

//mohammed was here
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
		request.session.cartID = request.session.username.toString() + request.sessionID.toString()
		return response.sendFile(path.join(__dirname + "/home/home.html"))
	} else {
		// Not logged in
		request.session.cartID = request.sessionID
		return response.sendFile(path.join(__dirname + "/home/home.html"))
	}
	response.end();
});

//route to return all the products in table 
app.get('/getproducts', function(request,response){
	let sql = 'SELECT * FROM products';
	connection.query(sql,function(err,res){
		if (err) {throw err;}
		return response.send(res)
	})
})

app.get('/getfilters', function(request,response){
	let sql ='SELECT DISTINCT product_type FROM products;'
	let finalresult = []
	connection.query(sql,function(err,results,fields){
		if(err){throw err;}
		Array.prototype.push.apply(finalresult,results)
	})
	sql = 'SELECT DISTINCT manufacturer FROM products'
	connection.query(sql,function(err,results){
		if(err){throw err;}
		Array.prototype.push.apply(finalresult,results)
		return response.send(finalresult)
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
	//if the user provides all neccesary info, we make them an account and save their data in the database
	if (username && password && email){
		connection.query('INSERT INTO accounts (username, password, email) VALUES (?,?,?)',[username,password,email]);
		req.session.loggedin=true;
		req.session.username = username
		return res.redirect('/home')

	}else{return res.send('Please enter username, password and e-mail address!')}
})

//route to add items to user's cart
app.post('/addToCart', function(request,response){
	
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
		connection.query('SELECT * FROM cart_items',function(err,res){
			if(res.length>0){
				for(let i = 0; i < res.length; i++){
					//if the product id and cart id match, update quantity
					if(res[i]['cart_id'] == cartID && res[i]['product_id'] == productID){
						//get current quantity and add 1
						newQuantity = parseInt(res[i]['quantity']) + 1
						connection.query('UPDATE cart_items SET quantity = ? WHERE product_id = ?',[newQuantity,productID])
						return
					}else if(i == (res.length - 1)){//otherwise add it into the cart_items table and set quantity to 1
						connection.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?,?,?)',[cartID,productID,1])
						return
					}
				}
			}
			else{
				connection.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?,?,?)',[cartID,productID,1])
			}
		})
	})
	
	return response.end()
})

app.get('/cart', function(request,response){
	//sends the cart page file to user
	response.sendFile(path.join(__dirname+'/purchase/cart.html'));
})

app.get('/getCart',function(request,response){
	if(request.session.loggedin){
		sql = "select product_id,price,product_name,quantity,manufacturer,product_description from cart natural join cart_items natural join products where cart_id = ?;"
		cart_id = request.session.cartID
		connection.query(sql,[cart_id],function(err,res){
			if(err){throw err;}
			return response.send(res)
		})
	}else{
		sql = "select product_id,price,product_name,quantity,manufacturer,product_description from cart natural join cart_items natural join products where cart_id = ?;"
		cart_id = request.session.cartID
		connection.query(sql,[cart_id],function(err,res){
			if(err){throw err;}
			return response.send(res)
		})
	}
})

app.post('/getFilteredProducts',function(request,response){
	//body contains filters in order: manufacturer, product_type
	
	let proceed = false
	sql = "select * from products"
	for(let i = 0; i<request.body.length-1; i++){
		if(request.body[i].length > 1){
			proceed = true
		}
	}
	if(proceed){
		sql = sql + " WHERE "
		
		for(let i = 0; i<request.body.length-1; i++){
			if(request.body[i].length > 1){
				if(i > 0 && sql.length > 35){sql = sql + " or "}
				sql = sql + request.body[i][0] + " in " + "('" + request.body[i].slice(1,request.body[i].length).join("','") + "')"
			}
		}
	}
	if(!proceed){
		sql = sql + " WHERE price BETWEEN " + request.body[request.body.length-1][0] + " AND " + request.body[request.body.length-1][1]
	}
	else{
		sql = sql + " AND price BETWEEN " + request.body[request.body.length-1][0] + " AND " + request.body[request.body.length-1][1]
	}
	
	console.log(sql)
	connection.query(sql, function(err,res){
		if(err){throw err}
		return response.send(res)
	})
	
})

app.post('/createOrder',function(request,response){
	console.log(request.body)
	var customer_id
	if(!request.session.loggedin){
		connection.query('INSERT INTO tempcust (email) VALUES (?)',[request.body['email']])
		connection.query('SELECT customer_id_temp FROM tempcust WHERE email = ?',[request.body['email']],function(err,res){
			if(err) throw err;
			customer_id = res[0]['customer_id_temp']
			console.log(customer_id)
			createOrder();
		})
	}else{
		connection.query('SELECT customer_id FROM accounts WHERE username = ?',[request.session.username],function(err,res){
			if(err) throw err;
			customer_id = res[0]['customer_id']
			console.log(customer_id)
			createOrder();
		})
	}

	function createOrder(){
		tracking_number = 'sampletrackingnumber'
		let date = new Date();
		let currentdate = date.toDateString();
		let order_id 
		//check to see if cust_id is in payment table, if it is simply update payment info, if not then insert it 
		connection.query('SELECT nameoncard FROM payments WHERE customer_id = ?',[customer_id],function(err,res){
			if(err) throw err;
			if(res[0]){
				let sql = 'UPDATE payments SET nameoncard = ?, card_number = ?, expr_month = ?, expr_year = ?, cvv = ? WHERE customer_id = ?'
				connection.query(sql,[request.body['nameOnCard'],request.body['cardNumber'],request.body['expMonth'],request.body['expYear'],request.body['cvv'],customer_id])

			}else{
				let sql='INSERT INTO payments (customer_id, nameoncard, card_number, expr_month, expr_year, cvv) values(?,?,?,?,?,?)'
				connection.query(sql,[customer_id,request.body['nameOnCard'],request.body['cardNumber'],request.body['expMonth'],request.body['expYear'],request.body['cvv']])
			}
		})
		let sql1 = 'INSERT INTO orders (tracking_number, order_date, customer_id, address, city, state, zipcode, status) VALUES (?,?,?,?,?,?,?,?)'

		connection.query(sql1,[tracking_number,currentdate,customer_id, request.body['address'],request.body['city'],request.body['state'],request.body['zipcode'],'placed'],function(err){
			if(err) throw err;
			connection.query('SELECT order_id FROM orders WHERE customer_id = ?',[customer_id],function(err,res){
				if(err) throw err;
				console.log("Order id: " + res[res.length-1]['order_id'])
				order_id = res[res.length-1]['order_id']
				let sql2='SELECT product_id,quantity FROM cart_items WHERE cart_id = ?'
				connection.query(sql2,[request.session.cartID],function(err,res){
					if(err) throw err;
					console.log(res);	
					for(let i = 0; i < res.length; i++){
						connection.query('INSERT INTO orderdetails (order_id,product_id,quantity) VALUES(?,?,?)',[order_id,res[i]['product_id'],res[i]['quantity']])
					}		
				})
				
			})
		})
		if(request.session.loggedin){
			response.redirect('/account')
		}else{
			response.redirect('/tempOrder')
		}

	}
})

app.get('/account',function(request,response){
	if(request.session.loggedin){
		return response.sendFile(path.join(__dirname + '/home/account.html'));
	}else{
		return response.send('Must be signed in to view account')
	}
})

app.get('/getAccountInfo',function(request,response){
	connection.query('SELECT * FROM accounts WHERE username = ?',[request.session.username],function(err,res){
		if(err)throw err;
		return response.send(res);
	})
})

app.post('/changeaccountinfo',function(request,response){
	if(request.body['newusername']){
		connection.query('UPDATE accounts SET username = ? WHERE username = ?',[request.body['newusername'].toString(),request.session.username])
		console.log('username changed from '+ request.session.username + " to " + request.body['newusername'].toString())
		request.session.username = request.body['newusername']
		response.end()		
	}
	if(request.body['newpassword']){
		connection.query('UPDATE accounts SET password = ? WHERE username = ?',[request.body['newpassword'].toString(),request.session.username])
		console.log('password updated')
		response.end()
	}
	if(request.body['newphone']){
		connection.query('UPDATE accounts SET phone = ? WHERE username = ?',[request.body['newphone'].toString(),request.session.username])
		console.log("phone changed")
		response.end()
	}
	if(request.body['address'] && request.body['city'] && request.body['state'] && request.body['zip']){
		connection.query('UPDATE accounts SET address=?,city=?,state=?,zip=? WHERE username = ?',[request.body['address'].toString(),request.body['city'].toString(),request.body['state'].toString(),request.body['zip'].toString(),request.session.username])
		console.log("address changed")
		response.end()
	}
	return
})

app.get('/getorderhistory',function(request,response){
	connection.query('SELECT customer_id FROM accounts WHERE username = ?',[request.session.username],function(err,res){
		let cust_id = res[0]['customer_id']
		connection.query('SELECT order_id, product_id, product_name, product_type, price, manufacturer, product_description, order_date FROM orders NATURAL JOIN orderdetails NATURAL JOIN products WHERE customer_id = ?',[cust_id],function(err,res){
			if(err)throw err;
			console.log(res)
			response.send(res)
		})
		return 
	})
})


app.listen(3000);
