const Sequelize= require("sequelize");
var sequelizeCon= require("../main.js");

const tasksTable= sequelizeCon.define('tasks',{
    task:{
        type: Sequelize.STRING
    },
    date:{
        type:Sequelize.DATE
    },
    time:{
        type:Sequelize.TIME
    },
    task_id:{
        type:Sequelize.INTEGER,
        primaryKey:true
    }
})

exports.tasksTable= tasksTable;