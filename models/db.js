import Sequelize from 'sequelize'
import { sequelize } from './dbConn.js'


const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  position: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    // Using `unique: true` in an attribute above is exactly the same as creating the index in the model's options
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});


const Company = sequelize.define('company', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING(400),
    allowNull: false
  },
  tel: {
    type: Sequelize.STRING,
    allowNull: false
  },
  logo: Sequelize.STRING,
  logoOriginName: Sequelize.STRING,
  image: Sequelize.STRING,
  imageOriginName: Sequelize.STRING,
  title1: Sequelize.STRING,
  paragraph1: Sequelize.TEXT,
  title2: Sequelize.STRING,
  paragraph2: Sequelize.TEXT,
  title3: Sequelize.STRING,
  paragraph3: Sequelize.TEXT,
})


const Job = sequelize.define('job', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  team: {
    type: Sequelize.STRING,
    allowNull: false
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  workType: {
    type: Sequelize.STRING,
    allowNull: false
  },
  employmentType: {
    type: Sequelize.STRING,
    allowNull: false
  },
  reason: {
    type: Sequelize.STRING,
    allowNull: false
  },
  hiringManagerEmail: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  responsibility: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  qualification: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  preferred: Sequelize.TEXT,
  status: {
    type: Sequelize.STRING,
    defaultValue: 'Open'
  }
}, 
{initialAutoIncrement:6000000}
)


const Candidate = sequelize.define('candidate', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  linkedin: Sequelize.STRING,
  website: Sequelize.STRING,
  github: Sequelize.STRING
},
{
  indexes: [{
    unique: true,
    fields: ['email', 'companyId']
  }]
},
{initialAutoIncrement:6000000}
)


const JobCandidate = sequelize.define('jobCandidate', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  resume: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  origin: {
    type: Sequelize.STRING,
    allowNull: false
  },
  originName: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

const Stage = sequelize.define('stage', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: Sequelize.STRING
},
{
  indexes: [{
    unique: true,
    fields: ['name', 'status']
  }]
})


const StageRecord = sequelize.define('stageRecord', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  interviewDate: Sequelize.DATE,
})


User.hasOne(Company, {foreignKey: {allowNull: false}})
Company.belongsTo(User)

Company.hasMany(Job, {foreignKey: {allowNull: false}})
Job.belongsTo(Company)

Company.hasMany(Candidate, {foreignKey: {allowNull: false}})
Candidate.belongsTo(Company)

Job.belongsToMany(Candidate, {through: JobCandidate, foreignKey: {name:'jobId', allowNull: false}})
Candidate.belongsToMany(Job, {through: JobCandidate, foreignKey: {name: 'candidateId', allowNull: false}})

Job.hasMany(JobCandidate)
JobCandidate.belongsTo(Job)

Candidate.hasMany(JobCandidate)
JobCandidate.belongsTo(Candidate)

JobCandidate.hasMany(StageRecord, {foreignKey: {allowNull: false}})
StageRecord.belongsTo(JobCandidate)

Stage.hasMany(StageRecord, {foreignKey: {allowNull: false}});
StageRecord.belongsTo(Stage);



export {User, Company, Job, Candidate, JobCandidate, Stage, StageRecord}