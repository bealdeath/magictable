'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Table extends Model {
    static associate(models) {
      Table.hasMany(models.Record, { foreignKey: 'tableId', as: 'records' });
    }
  }

  Table.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Table',
  });

  return Table;
};
