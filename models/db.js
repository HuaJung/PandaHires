import Sequelize from 'sequelize'
import { sequelize } from './dbConn.js'

const Users = sequelize.define(
  'users', {
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
    // Using `unique: true` in an attribute above is exactly the same as creating the index in the model's options:
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});


const Companies = sequelize.define(
  'companies', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: Users,
        key: 'id'
      }
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
    logo_img: Sequelize.STRING,
    img: Sequelize.STRING,
    title_1: Sequelize.STRING,
    paragraph_1: Sequelize.TEXT,
    title_2: Sequelize.STRING,
    paragraph_2: Sequelize.TEXT,
    title_3: Sequelize.STRING,
    paragraph_3: Sequelize.TEXT,
  }
)

const Jobs = sequelize.define(
  'jobs', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    company_id: {
      type: Sequelize.INTEGER,
      allowNull:false,
      refernce: { 
        model: Companies,
        key: 'id'
      }
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
    work_type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    employment_type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    reason: {
      type: Sequelize.STRING,
      allowNull: false
    },
    hiring_manager_email: {
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
    preferred: Sequelize.TEXT

  }
)

const Candidates = sequelize.define(
  'candidates', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
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
    resume_name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    linkedin: Sequelize.STRING,
    website: Sequelize.STRING,
    github: Sequelize.STRING
  }
)

const JobCandidate = sequelize.define(
  'jobCandidate', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    job_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: Jobs,
        key: 'id'
      }
    },
    candidate_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: Candidates,
        key: 'id'
      }
    }
  }
)

const Stages = sequelize.define(
  'stages', {
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
    sataus: Sequelize.STRING
  }
)
const StageRecords = sequelize.define(
  'stageRecords', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    job_candidate_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: JobCandidate,
        key: 'id'
      } 
    },
    stage_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: Stages,
        key: 'id'
      }
    }
  }
)


export {Users, Companies, Jobs, Candidates, JobCandidate, Stages, StageRecords}