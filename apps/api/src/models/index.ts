// C:\Users\Andy\Downloads\testing\my-workspace\apps\api\src\models\index.ts
import { Sequelize } from 'sequelize';
import { User } from './user';
import { Table } from './table';
import { Record } from './record';

const sequelize = new Sequelize(process.env.DB_URI!, {
  dialect: 'postgres',
  logging: console.log,
});

// Initialize models
User.initModel(sequelize);
Table.initModel(sequelize);
Record.initModel(sequelize);

// Synchronize all models with the database
sequelize.sync();

export { sequelize, User, Table, Record };
