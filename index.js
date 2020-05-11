const express = require('express')
const app = express();
const path = require('path')
const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const ObjectId = require('mongodb').ObjectID
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const shortid = require("shortid");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtVerify = require("express-jwt");
const SECRET_KEY = fs.readFileSync("private.key");


dbUrl = 'mongodb://mo1030_traveo:Lemon2@mongo26.mydevil.net:27017/mo1030_traveo'
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
})


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
})




app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
