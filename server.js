// import { usersTable } from "./database/tables/users";

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
    const user = usersDb.build({
        username:req.body.username,
        password:req.body.password
        
    });

    user.save().then(()=>{
        console.log("the user",req.body.username,"saved in the database");
        res.send("the user saved in the database");
    }).catch(err =>{
        console.log("Oops can not save the user because","\n",err)
        res.send("Oops can not save the user because");
    })  
})

app.post('/login',(req,res)=>{
    usersDb.findOne({where:{username:req.body.username}}).then(user =>{
        if(req.body.password === "1234"){
            res.send("welcom");
            console.log("------------------------->","welcom"+user.username);
        }
        res.send("wrong password")
    }).catch(err =>{
        console.log("can not find user beause ",err);
        res.send("we do not have this user");
    })
})

app.post('/updateUser',(req,res)=>{
    if(req.body.username){
        usersDb.findOne({where:{username:"ammar"}}).then(user =>{
            user.update({username:req.body.username},{where:{user_id:user.user_id}}).then(() =>{
                console.log("user updated");
            })
        })
        
    }else if(req.body.password){
            usersDb.update({password:req.body.password}).then(()=>{
                res.sendStatus(200)
                .send("you updated your password to "+req.body.password);
        })
    }
   console.log("we do not have data");

})

app.post('/deleteUser',(req,res) =>{
    usersDb.findOne({where:{user_id:req.body.user_id}}).then(user => {
        user.destroy({force:true});
        res.send("the is deleted thanks");
    })
})

//check db conection function
var mainDB= require("./database/main.js");

// listning function part
var port= process.env.Port || 5000;

app.listen(port, () =>{
    console.log("server is listning on port ",port);
})