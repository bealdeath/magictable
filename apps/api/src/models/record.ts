// C:\Users\Andy\Downloads\testing\my-workspace\apps\api\src\models\record.ts
import { Sequelize, Model, DataTypes } from 'sequelize';
import { Table } from './table';

export class Record extends Model {
  public id!: number;
  public content!: string;
  public tableId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize): void {
    Record.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tableId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Table,
          key: 'id',
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      sequelize,
      modelName: 'Record',
    });
  }
}
