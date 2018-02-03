var express= require("express");
var app= express();
var morgan= require("morgan");
app.use(morgan('dev'));
var bodyParser= require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/", (request,response) => {
    response.send("welcom to server");
})



// listning part
var port= process.env.Port || 5000;

app.listen(port, () =>{
    console.log("server is listning on port ",port);
})