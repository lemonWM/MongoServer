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
const multer = require('multer');
const upload = multer({ dest: 'public/data/images'});

dbUrl = 'mongodb://mo1030_traveo:Bieszczady1@mongo26.mydevil.net:27017/mo1030_traveo'
urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use( cors() );
app.use( bodyParser.json() );
app.use( express.static("public") );


/* Routes */
app.get('/places', function(req, res, next){
    
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

app.get('/place/:id', function(req, res, next){ 
    
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


// for user login - recive token
app.post("/login", function(req, res) {
	
    MongoClient.connect(dbUrl, function(err, db){

        if(err){
            res.status(500);
            res.json({error: true});

            return;
        }
       
			const user = req.body.username
			const password = req.body.password
		 
        db.collection('users').find({username: user}).toArray(function(err, docs) {  

				 if(!user) {
					  return res.status(401).json({
							error: "Unauthorized"
					  })
				 }
			  
			  let userPassword = ''
			  let userName =''
			  
			   docs.forEach(function(doc){
               userPassword =  doc.password;
					userName = doc.username
            })
			    
			   const findedUser = docs[0]
				
			  	const passwordMatch = bcrypt.compare(password || "", userPassword, function(err, result) {

                    if(err) {
                            console.log(err);
                            return res.status(500).json({
                                error: "login error"
                            })
                    }

                    if(result === false) {
                            return res.status(401).json({
                                error: "Password is not correct"
                            })
                    }

                    if(result === true) {

                            const token = jwt.sign({
                                username: userName
                            }, SECRET_KEY, {
                                expiresIn: "1h"
                            })

                            return res.json({ token , findedUser});
                    }
                    db.close()
                })
        })
    })
})


// for validation username ->
app.post("/userValid", function(req, res) {
	
    MongoClient.connect(dbUrl, function(err, db){
		 
		 const user = req.body.username;

        if(err){
            res.status(500);
            res.json({error: true});

            return;
        }
        
        db.collection("users").find({username: user}).toArray(function(err, doc){

           if(err) {
                res.status(500);
                res.json({unique: false});

                return;
           }
			  if(doc[0]){
				  res.json({
						unique: false
					})
			  } else {
				  res.json({
						unique: true
					})				  
			  }
            db.close()
        })
    })
});


// for register new user
app.post("/user/register", function(req, res) {
	
	    MongoClient.connect(dbUrl, function(err, db) {

			  if(err) {
					res.status(500);
					res.json({error: true});

					return;
			  }

			  bcrypt.hash(req.body.password, 10, function(err, hash) {

				  const user = {
					  username: req.body.username,
					  password: hash
				  }

				  db.collection("users").insert(user, function(err, doc) {

						if(err) {
							 res.status(500);
							 res.json({error: true});

							 return;
						}
						res.json(doc[0])

						db.close();
				  });		
				})	
		 });
});


// upload image from create article
app.post("/image/upload", upload.single('file'), function (req, res, next) {

	console.log(req.file)
	
	res.send({
		dest: req.file.destination,
		name: req.file.filename,
		path: req.file.path
	})
})

// load img 
app.get("/load/:img", function(req, res, next) {
	
	const imgName = req.params.img

	res.contentType('image/jpeg');
	res.sendFile(__dirname + '/public/data/images/'+ imgName);
})




app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
