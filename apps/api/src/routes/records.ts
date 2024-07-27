// C:\Users\Andy\Downloads\testing\my-workspace\apps\api\src\routes\records.ts
import express, { Request, Response } from 'express';
import { Record } from '../models/record';
import { Op } from 'sequelize';

const router = express.Router();

// Fetch all records with sorting, pagination, and searching
router.get('/', async (req: Request, res: Response) => {
  const { sortField = 'id', sortOrder = 'ASC', page = 1, search = '' } = req.query;
  const limit = 10;
  const offset = (Number(page) - 1) * limit;

  try {
    const records = await Record.findAll({
      where: search ? {
        [Op.or]: [
          { content: { [Op.iLike]: `%${search}%` } },
        ],
      } : {},
      order: [[String(sortField), String(sortOrder)]],
      limit,
      offset,
    });

    const totalRecords = await Record.count({
      where: search ? {
        [Op.or]: [
          { content: { [Op.iLike]: `%${search}%` } },
        ],
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
router.post('/', async (req: Request, res: Response) => {
  const { content, tableId } = req.body;

  try {
    const newRecord = await Record.create({ content, tableId });
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).json({ error: 'Error adding record' });
  }
});

// Edit an existing record
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, tableId } = req.body;

  try {
    const record = await Record.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    record.content = content;
    record.tableId = tableId;
    await record.save();

    res.json(record);
  } catch (error) {
    console.error('Error editing record:', error);
    res.status(500).json({ error: 'Error editing record' });
  }
});

// Delete a record
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const record = await Record.findByPk(id);
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
