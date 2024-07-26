'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

// Load environment variables from .env file
require('dotenv').config();

// Log the DB URI to confirm it is loaded correctly
console.log('DB_URI:', process.env.DB_URI);

// Set up Sequelize instance
const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',  // Adjust to your database dialect
  logging: false,       // Disable logging if not needed
});

// Dynamically import all models in the directory
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    console.log(`Requiring model: ${modelPath}`);
    const model = require(modelPath);
    console.log(`Model export type: ${typeof model}`);
    if (typeof model !== 'function') {
      throw new Error(`Model ${file} does not export a function`);
    }
    const initializedModel = model(sequelize, Sequelize.DataTypes);
    db[initializedModel.name] = initializedModel;
  });

// Associate models if association is defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
