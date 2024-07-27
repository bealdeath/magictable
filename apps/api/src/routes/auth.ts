// C:\Users\Andy\Downloads\testing\my-workspace\apps\api\src\routes\auth.ts
import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { Op } from 'sequelize'; // Import Op from sequelize

const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Auth route received request: ${req.method} ${req.url}`);
  next();
});

// Register route
router.post('/register', async (req: Request, res: Response) => {
  console.log('Handling /register route');
  console.log('Request Body:', req.body); // Log the request body to see the incoming data
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      console.log('Missing fields in request body');
      return res.status(400).json({ error: 'All fields are required' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      console.log('Email already in use');
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Creating user with:', { firstName, lastName, email, password: hashedPassword, role });

    const user = await User.create({ firstName, lastName, email, password: hashedPassword, role });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    console.log('User created successfully:', user);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  console.log('Handling /login route');
  console.log('Request Body:', req.body); // Log the request body to see the incoming data
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password in request body');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    console.log('User logged in successfully:', user);
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Fetch all users with sorting and pagination
router.get('/users', async (req: Request, res: Response) => {
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
router.post('/users', async (req: Request, res: Response) => {
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
router.put('/users/:id', async (req: Request, res: Response) => {
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
router.delete('/users/:id', async (req: Request, res: Response) => {
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
