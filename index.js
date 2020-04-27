const express = require('express')
const app = express();
const path = require('path')
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 5000

app.use( cors() );
app.use( bodyParser.json() );
app.use( express.static("public") );

app.get("/product", function(req, res) {

    res.json( require("./data/product.json") );

});

app.post("/order", function(req, res) {

    res.json({
        success: true
    });

});

  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
