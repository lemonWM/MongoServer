const express = require('express');
const app = express();
const path = require('path');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const shortid = require("shortid");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtVerify = require("express-jwt");
const SECRET_KEY = fs.readFileSync("private.key");
const PORT = process.env.PORT || 5000;

dbUrl = 'mongodb://mo1030_traveo:Bieszczady1@mongo26.mydevil.net:27017/mo1030_traveo'
urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use( cors() );
app.use( bodyParser.json() );
app.use( express.static("public") );


/* Routes */
app.get('/places', function(req, res){
    
    MongoClient.connect(dbUrl, function(err, db) { 

        if(err) {
            res.status(500);
            res.send({error: true});

            return;
        }
    
        db.collection("places").find({}).toArray(function(err, docs) {
              
            if(err) {     
                res.status(500);
                res.json({error: true});

                return;
            }
            res.json(docs)
            db.close()
        })
    })
});

app.get('/place/:id', function(req, res){ 
    
    const id = req.params.id
    const isValid = ObjectId.isValid(id)

    if(! isValid ) {
        res.status(500);
        res.json({error: true});

        return;
    }

    MongoClient.connect(dbUrl, function(err, db){

        if(err){
            res.status(500);
            res.json({error: true});

            return;
        }
        
        db.collection("places").find({_id: new mongo.ObjectID(id)}).toArray(function(err, doc){

            if(err) {
                res.status(500);
                res.json({error: true});

                return;
            }

            res.json(doc[0])
            db.close()
        })
    })
});


app.get('/articles', function(req, res){
    
    MongoClient.connect(dbUrl, function(err, db) { 

        if(err) {
            res.status(500);
            res.send({error: true});

            return;
        }
    
        db.collection("articles").find({}).toArray(function(err, docs) {
              
            if(err) {     
                res.status(500);
                res.json({error: true});

                return;
            }
            res.json(docs)
            db.close()
        })
    })
});


app.get('/articles/:id', function(req, res){ 
    
    const id = req.params.id
    const isValid = ObjectId.isValid(id)

    if(! isValid ) {
        res.status(500);
        res.json({error: true});

        return;
    }

    MongoClient.connect(dbUrl, function(err, db){

        if(err){
            res.status(500);
            res.json({error: true});

            return;
        }
        
        db.collection("articles").find({_id: new mongo.ObjectID(id)}).toArray(function(err, doc){

            if(err) {
                res.status(500);
                res.json({error: true});

                return;
            }

            res.json(doc[0])
            db.close()
        })
    })
});

app.post("/login", function(req, res) {
	
    const isValid = ObjectId.isValid(id)

    if(! isValid ) {
        res.status(500);
        res.json({error: true});

        return;
    }	
	
    MongoClient.connect(dbUrl, function(err, db){

        if(err){
            res.status(500);
            res.json({error: true});

            return;
        }
       
		 const user = req.body.username
		 
        db.collection('users').find({username: user}).toArray(function(err, docs){

				 if(!user) {
					  return res.status(401).json({
							error: "Unauthorized"
					  })
				 }
			    
			  	const passwordMatch = bcrypt.compare(req.body.password || "", user.password, function(err, result) {

				  if(err) {
						console.log(err);
						return res.status(500).json({
							 error: "Internal Server Error"
						})
				  }

				  if(result === false) {
						return res.status(401).json({
							 error: "Unauthorized"
						})
				  }

				  if(result === true) {

						const token = jwt.sign({
							 username: user.username
						}, SECRET_KEY, {
							 expiresIn: "1h"
						})

						return res.json({ token });

				  }
			db.close()

    })
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
