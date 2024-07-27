'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Record extends Model {
    static associate(models) {
      Record.belongsTo(models.Table, { foreignKey: 'tableId', as: 'table' });
    }
  }

  Record.init({
    content: {
      type: DataTypes.JSON,
      allowNull: false
    },
    tableId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Tables',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Record',
  });

  return Record;
};
