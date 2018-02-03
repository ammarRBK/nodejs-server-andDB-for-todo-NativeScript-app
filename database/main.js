var sequelize= require("sequelize");

const connection= new sequelize("todousers","root","ammar5301",{
    host:"127.0.0.1",
    port:3306,
    dialect: 'mysql',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
})

//Checking connection status
exports.checkCon = () =>{sequelize.authenticate()
	.then(function(err) {
		console.log('Connection to database has been established successfully');
	})
	.catch(function (err) {
	    console.log('There is connection ERROR', err);
    })

}
    
module.exports= connection;