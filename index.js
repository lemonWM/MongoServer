const express = require('express')
const app = express();
const path = require('path')
const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const ObjectId = require('mongodb').ObjectID
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5000

dbUrl = 'mongodb://mo1030_appTravel:Lemon2@mongo26.mydevil.net:27017/mo1030_appTravel'
urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use( cors() );
app.use( bodyParser.json() );
app.use( express.static("public") );


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

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
