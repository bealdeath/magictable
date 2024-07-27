// C:\Users\Andy\Downloads\testing\my-workspace\apps\api\src\routes\data.ts
import express, { Request, Response } from 'express';
import { Op, ModelStatic } from 'sequelize';
import { Record } from '../models/record';
import { User } from '../models/user'; // Import User model

const router = express.Router();

// Get all records with sorting, pagination, and searching
router.get('/:tableName', async (req: Request, res: Response) => {
  const { tableName } = req.params;
  const { sortField = 'id', sortOrder = 'ASC', page = 1, search = '' } = req.query;
  const limit = 10;
  const offset = (Number(page) - 1) * limit;

  try {
    let model: ModelStatic<any>;
    if (tableName === 'records') {
      model = Record;
    } else if (tableName === 'users') {
      model = User;
    } else {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    const records = await model.findAll({
      where: search ? {
        [Op.or]: Object.keys(model.getAttributes()).map((key) => ({
          [key]: { [Op.iLike]: `%${search}%` }
        })),
      } : {},
      order: [[sortField as string, sortOrder as string]],
      limit,
      offset,
    });

    const totalRecords = await model.count({
      where: search ? {
        [Op.or]: Object.keys(model.getAttributes()).map((key) => ({
          [key]: { [Op.iLike]: `%${search}%` }
        })),
      } : {},
    });

    res.json({
      records,
      totalPages: Math.ceil(totalRecords / limit),
    });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Error fetching records' });
  }
});

// Add a new record
router.post('/:tableName', async (req: Request, res: Response) => {
  const { tableName } = req.params;
  const data = req.body;

  try {
    let model: ModelStatic<any>;
    if (tableName === 'records') {
      model = Record;
    } else if (tableName === 'users') {
      model = User;
    } else {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    const newRecord = await model.create(data);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).json({ error: 'Error adding record' });
  }
});

// Edit an existing record
router.put('/:tableName/:id', async (req: Request, res: Response) => {
  const { tableName, id } = req.params;
  const data = req.body;

  try {
    let model: ModelStatic<any>;
    if (tableName === 'records') {
      model = Record;
    } else if (tableName === 'users') {
      model = User;
    } else {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    const record = await model.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    await record.update(data);
    res.json(record);
  } catch (error) {
    console.error('Error editing record:', error);
    res.status(500).json({ error: 'Error editing record' });
  }
});

// Delete a record
router.delete('/:tableName/:id', async (req: Request, res: Response) => {
  const { tableName, id } = req.params;

  try {
    let model: ModelStatic<any>;
    if (tableName === 'records') {
      model = Record;
    } else if (tableName === 'users') {
      model = User;
    } else {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    const record = await model.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    await record.destroy();
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Error deleting record' });
  }
});

export default router;
