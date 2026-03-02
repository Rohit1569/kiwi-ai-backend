require('dotenv').config();
const pg = require('pg');

const config = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'personal-assistant',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
  define: {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};

// If using the full connection string (Neon Tech / Vercel)
if (process.env.DATABASE_URL) {
  const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');
  
  const sslConfig = isLocal ? {} : {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };

  module.exports = {
    development: {
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
      dialectModule: pg,
      dialectOptions: sslConfig
    },
    production: {
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
      dialectModule: pg,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  };
} else {
  module.exports = {
    development: config,
    production: {
      ...config,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  };
}
