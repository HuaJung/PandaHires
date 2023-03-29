import Sequelize from 'sequelize'
import dotenv from 'dotenv';
dotenv.config();


const sequelize = new Sequelize (
  process.env.DATABASE_NAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    dialect: 'mysql',
    dialectOptions: {
      ssl: 'Amazon RDS'
    },
    logging: console.log
  }
)


export{sequelize}