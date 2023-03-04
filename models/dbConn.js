import mysql from 'mysql2';
import Sequelize from 'sequelize'
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'mysql',
    host: process.env.DB_HOST
  })


// const sequelize = new Sequelize (
//   process.env.DATABASE_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
//     host: process.env.RDS_HOSTNAME,
//     port: process.env.RDS_PORT,
//     dialect: 'mysql',
//     dialectOptions: {
//       ssl: 'Amazon RDS'
//     },
//     logging: console.log
//   }
// )


export{sequelize}