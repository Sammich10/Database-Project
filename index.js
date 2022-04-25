const express = require('express')
const mysql = require('mysql');
const { isBuffer } = require('util');

//create connection
const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'10272000'
});

//establish connection to database
db.connect(err=>{
    if(err){
        throw err
    }
    console.log('MySQL connected successfully');
});

const app = express();

//Create the database
app.get('/createdb',(req,res)=>{
    let sql = 'CREATE DATABASE nodemysql'
    db.query(sql,err=>{
        if(err){
            throw err
        }
        res.send('Database created');
    });
});

//Create a table
app.get('/createtables', (req,res)=>{
    /*TODO CREATE AND RUN SQL TABLE CREATION SCRIPTS*/
})

//Insert data into table
app.get('insertinfo',(req,res)=>{
    let post = {attribute:'value', attribute2:'value2'}
    let sql = 'INSERT INTO exampletable SET ?'
    let query = db.query(sql,post,err=>{
        if(err){
            throw err
        }
        res.send('Successful')
    })
})

//Get data from table
app.get('/getinfo',(req,res)=>{
    let sql = 'SELECT * FROM exampletable'
    let query = db.query(sql,(err,results)=>{
        if(err){
            throw err
        }
        console.log(results)
        res.send('Data fetched')
    })
})

//Update information in table
app.get('/updateinfo/:id',(req,res)=>{
    let sql = `UPDATE exampletable SET attribute = '${newAttribute}' WHERE id = '${req.params.id}'`
    let query = db.query(sql, err=>{
        if(err){
            throw err
        }
        res.send('Information updated')
    })
})


//Start web app and listen on port 3001
app.listen('3001',()=>{
    console.log('Server started on port 3001')
}) 