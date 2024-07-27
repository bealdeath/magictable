// C:\Users\Andy\Downloads\testing\my-workspace\apps\api\src\routes\users.ts
import express, { Request, Response } from 'express';
import { User } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

// Fetch all users with sorting and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const { sortField = 'id', sortOrder = 'ASC', page = 1, search = '' } = req.query;
    const limit = 10;
    const offset = (Number(page) - 1) * limit;

    const users = await User.findAndCountAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      },
      order: [[String(sortField), String(sortOrder)]],
      limit,
      offset,
    });

    res.json({
      users: users.rows,
      totalPages: Math.ceil(users.count / limit),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Add new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, role } = req.body;

    if (!firstName || !lastName || !email || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const newUser = await User.create({ firstName, lastName, email, role });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Error adding user' });
  }
});

// Edit user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.role = role;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

export default router;
