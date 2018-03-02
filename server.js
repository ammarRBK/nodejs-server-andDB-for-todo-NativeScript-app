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

app.get('/getAllUsers',(req,res) => {
    usersDb.findAll().then(users =>{
        res.send(users);
    })
})
app.get("/checkLoggedin",(req,res) => {
    if(!req.session.user.username){
        res.send("not loggedin");
    }else{
        res.send("loggedin");
    }
})

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
        res.send({user:null,message:"wrong username"});
    })  
});

app.post('/login',(req,res)=>{
    usersDb.findOne({where:{username:req.body.username}}).then(user =>{
        console.log("------------------------->","welcom "+user.username+"\n"+user.password+"\n");
        req.session.user= user;
        console.log(req.session.user);
        res.send(user);       
    }).catch(err =>{
        console.log("can not find user beause ",err);
        res.ok= false;
        res.send(404,"we do not have this user");
    })
});

app.get('/logout',(req,res) => {
    if(!req.session.user){
        res.send("not loggedin")
    }
    req.session.destroy();
    res.send("تم تسجيل الخروج")
})

app.post('/updateUser',(req,res)=>{
    if(req.body.username){
        usersDb.findOne({where:{username:req.body.username}}).then(user =>{
            user.update({username:req.body.username},{where:{user_id:user.user_id}}).then(() =>{
                console.log("user updated");
            })
        })
        
    }else if(req.body.password){
            usersDb.update({password:req.body.password}).then(()=>{
                res.send(200,"you updated your password to "+req.body.password);
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

app.post('/addTask',(req,res) => {
    console.log(200,req.session.user);
    const newTask=  tasksDb.build({
        task: req.body.task,
        date: new Date(),
        time: "02:25 pm",
        user_id: req.session.user.user_id
    })
    newTask.save().then( ()=>{
        tasksDb.findOne({where:{task:req.body.task}}).then(task => {
        	res.send({task:task.task,taskId:task.task_id});
        	console.log("thanks");
        })
        
    })
    .catch(error =>{
        console.log("cannot add task","\n","----------->",error);
        res.send("cannot add task")
    })
});

app.get('/getTasks',(req,res)=> {
    console.log(req.session.user);
    tasksDb.findAll({where:{user_id: req.session.user.user_id}}).then(tasks =>{
        console.log("-----------------45555444> these are your tasks ","\n",tasks);
        res.send(200,tasks);
    })
    .catch(error => {
        console.log("error in database ","\n",error);
        res.send(500,error);
    })
});

app.put('/editTask',(req,res)=> {
    var oldTaskID= req.body.oldTaskID;
    var newTask= req.body.newTask;
    console.log(oldTaskID);
    tasksDb.findAll({where:{task_id:oldTaskID}}).then(task => {
        res.send(task);
        task.update({task:newTask}).then( ()=>{
            console.log("task updated");
        })
    })
    .catch(error => {
        console.log("cannot edit task because ",error);
        res.send(500,error)
    })

});

app.delete('/deleteTask',(req,res) => {
    var taskId= req.body.taskId;
    tasksDb.findOne({where:{task_id:taskId}}).then(task => {
        task.destroy({force:true});
        res.send(200,"task is deleted");
    })
    .catch( error => {
        console.log("cannot find task because ","\n",error);
        res.send(500,error);
    })
});
//check db conection function
var mainDB= require("./database/main.js");

// listning function part
var port= process.env.Port || 5000;

app.listen(port, () =>{
    console.log("server is listning on port ",port);
})