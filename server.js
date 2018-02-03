var express= require("express");
var app= express();
//database required files
var tasksDb= require("./database/tables/tasks.js").tasksTable;
var usersDb= require("./database/tables/users.js").usersTable;

//midlleware connection status
var morgan= require("morgan");
app.use(morgan('dev'));
var bodyParser= require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//session for tracking the users
var session = require('express-session'); 
app.use(session({
    secret: "ptb",
    resave: true,
    saveUninitialized: true
}));

//headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
 
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');
 
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
 
    // Pass to next layer of middleware
    next();
 });
 
//welcom message
app.get("/", (request,response) => {
    response.send("welcom to server");
});

app.post("/adduser",(req,res)=>{
    console.log(req.body);
})


//check db conection function
var mainDB= require("./database/main.js");

// listning function part
var port= process.env.Port || 5000;

app.listen(port, () =>{
    console.log("server is listning on port ",port);
})