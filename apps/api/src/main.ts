import express from 'express';
import { sequelize, User, Table, Record } from './models';
import jwt from 'jsonwebtoken';
import authenticateJWT from './middleware/auth';
import verifyRole from './middleware/verifyRole';
import path from 'path';
import cors from 'cors';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: process.env.CORS_ORIGIN }));

console.log('Email user:', process.env.AWS_SES_USER);
console.log('Email pass:', process.env.AWS_SES_PASS);
console.log('JWT secret:', process.env.JWT_SECRET);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AWS_SES_USER,
    pass: process.env.AWS_SES_PASS
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synchronized.');
  })
  .catch((err: Error) => {
    console.error('Unable to connect to the database:', err);
  });

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role, isAdmin } = req.body;
  try {
    const user = await User.create({ firstName, lastName, email, password, role, isAdmin });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

    await transporter.sendMail({
      from: process.env.AWS_SES_USER,
      to: user.email,
      subject: 'Email Verification',
      text: `Click this link to verify your email: ${verificationLink}`
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/verify-email', async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const user = await User.findOne({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/recover-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    const recoveryLink = `http://localhost:3000/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.AWS_SES_USER,
      to: user.email,
      subject: 'Password Recovery',
      text: `Click this link to recover your password: ${recoveryLink}`
    });

    res.json({ message: 'Recovery email sent' });
  } catch (error) {
    console.error('Error sending recovery email:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const user = await User.findOne({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/data', authenticateJWT, async (req, res) => {
  const { sortField, sortOrder, page = 1, limit = '10', search = '' } = req.query;

  try {
    let queryOptions: any = {
      attributes: { exclude: ['password', 'isAdmin'] },
      order: [],
      where: {}
    };

    if (sortField && sortOrder) {
      queryOptions.order.push([sortField, sortOrder]);
    }

    if (search) {
      queryOptions.where = {
        [Op.or]: [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    const { count, rows } = await User.findAndCountAll({
      ...queryOptions,
      offset,
      limit: parseInt(limit as string)
    });

    const totalPages = Math.ceil(count / parseInt(limit as string));

    res.json({
      columns: Object.keys(User.rawAttributes).filter(column => column !== 'password' && column !== 'isAdmin'),
      users: rows,
      total: count,
      totalPages
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/tables', authenticateJWT, async (req, res) => {
  try {
    const tables = await Table.findAll();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/tables', authenticateJWT, async (req, res) => {
  try {
    const { name } = req.body;
    const table = await Table.create({ name });
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/tables/:tableId/records', authenticateJWT, async (req, res) => {
  try {
    const { tableId } = req.params;
    const records = await Record.findAll({ where: { tableId } });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.post('/tables/:tableId/records', authenticateJWT, async (req, res) => {
  try {
    const { tableId } = req.params;
    const { content } = req.body;
    const record = await Record.create({ content, tableId });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.put('/tables/:tableId/records/:recordId', authenticateJWT, async (req, res) => {
  try {
    const { tableId, recordId } = req.params;
    const { firstName, lastName, email, role } = req.body; // Add the fields you want to update

    const record = await User.findOne({ where: { id: recordId } });
    if (record) {
      record.firstName = firstName;
      record.lastName = lastName;
      record.email = email;
      record.role = role;

      await record.save();
      res.json(record);
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.delete('/tables/:tableId/records/:recordId', authenticateJWT, async (req, res) => {
  try {
    const { tableId, recordId } = req.params;
    const record = await Record.findOne({ where: { id: recordId, tableId } });
    if (record) {
      await record.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/chart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chart.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
