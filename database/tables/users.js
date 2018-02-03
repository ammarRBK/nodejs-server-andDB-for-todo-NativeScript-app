const Sequelize= require("sequelize");
const sequelizeCon= require("../main.js");
var tasksTable= require("./tasks").tasksTable;
const usersTable= sequelizeCon.define('users',{
    username:{
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password:{
        type: Sequelize.CHAR,
        allowNull: false
    },
    user_id:{
        primaryKey:true
    }
})
//set "one to many" relation, that means the user has many tasks 
usersTable.hasMany(tasksTable,{foreignKey:"user_id"})

exports.usersTable= usersTable;