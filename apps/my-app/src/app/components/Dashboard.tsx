import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Link } from 'react-router-dom';

interface Record {
  id: number;
  content: { [key: string]: any };
  tableId: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface NewRecord {
  content: { [key: string]: any };
  tableId: number;
}

interface DashboardProps {
  userRole: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [records, setRecords] = useState<Record[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<string>('ASC');
  const [editRecord, setEditRecord] = useState<Record | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newRecord, setNewRecord] = useState<NewRecord>({ content: {}, tableId: 1 });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [table, setTable] = useState<string>('records'); // Default table to 'records'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/data/${table}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { sortField, sortOrder, page, search },
        });

        if (table === 'records') {
          if (response.data.records.length > 0) {
            const fetchedColumns = Object.keys(response.data.records[0].content).filter(
              (column) => !['id', 'createdAt', 'updatedAt', 'tableId'].includes(column)
            );
            setColumns(fetchedColumns);
          }
          setRecords(response.data.records);
        } else if (table === 'users') {
          if (response.data.records.length > 0) {
            const fetchedColumns = Object.keys(response.data.records[0]).filter(
              (column) => !['password', 'createdAt', 'updatedAt'].includes(column)
            );
            setColumns(fetchedColumns);
          }
          setUsers(response.data.records);
        }
        setTotalPages(response.data.totalPages);
      } catch (error: unknown) {
        console.error('Error fetching data:', error);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            alert(`Error fetching data: ${error.response.data.message}`);
          } else {
            alert('Error fetching data. Please try again later.');
          }
        } else {
          alert('Unexpected error occurred. Please try again later.');
        }
      }
    };

    fetchData();
  }, [sortField, sortOrder, page, search, table]);

  const handleSort = (field: string) => {
    const order = sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortField(field);
    setSortOrder(order);
  };

  const handleEdit = (record: Record) => setEditRecord(record);

  const handleEditUser = (user: User) => setEditUser(user);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/data/${table}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (table === 'records') {
        setRecords(records.filter((record) => record.id !== id));
      } else if (table === 'users') {
        setUsers(users.filter((user) => user.id !== id));
      }
      alert('Record deleted successfully');
    } catch (error: unknown) {
      console.error('Error deleting record:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(`Error deleting record: ${error.response.data.message}`);
        } else {
          alert('Error deleting record. Please try again later.');
        }
      } else {
        alert('Unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (table === 'records' && editRecord) {
        await axios.put(`http://localhost:5000/api/data/${table}/${editRecord.id}`, editRecord, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(records.map((record) => (record.id === editRecord.id ? editRecord : record)));
        setEditRecord(null);
        alert('Record updated successfully');
      } else if (table === 'users' && editUser) {
        await axios.put(`http://localhost:5000/api/data/${table}/${editUser.id}`, editUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.map((user) => (user.id === editUser.id ? editUser : user)));
        setEditUser(null);
        alert('User updated successfully');
      }
    } catch (error: unknown) {
      console.error('Error updating record:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(`Error updating record: ${error.response.data.message}`);
        } else {
          alert('Error updating record. Please try again later.');
        }
      } else {
        alert('Unexpected error occurred. Please try again later.');
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (table === 'records') {
      setEditRecord((editRecord) =>
        editRecord ? { ...editRecord, content: { ...editRecord.content, [name]: value } } : null
      );
    } else if (table === 'users') {
      setEditUser((editUser) => (editUser ? { ...editUser, [name]: value } : null));
    }
  };

  const handleNewInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewRecord({ ...newRecord, content: { ...newRecord.content, [name]: value } });
  };

  const handleAddRecord = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5000/api/data/${table}`, newRecord, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords([...records, response.data]);
      setNewRecord({ content: {}, tableId: 1 });
      setShowAddForm(false);
      alert('Record added successfully');
    } catch (error: unknown) {
      console.error('Error adding record:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(`Error adding record: ${error.response.data.message}`);
        } else {
          alert('Error adding record. Please try again later.');
        }
      } else {
        alert('Unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <label>Search: </label>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div>
        <label>Sort Field: </label>
        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
        <label>Sort Order: </label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
        <button onClick={() => handleSort(sortField)}>Apply Sort</button>
      </div>

      <div>
        <button onClick={() => setTable('records')}>View Records</button>
        <button onClick={() => setTable('users')}>View Users</button>
      </div>

      {/* Navigation to Grid View */}
      <div style={{ marginTop: '20px' }}>
        <Link to="/grid-view" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
            }}
          >
            Go to Grid View
          </button>
        </Link>
      </div>

      {records.length === 0 && table === 'records' && <p>No records found.</p>}
      {users.length === 0 && table === 'users' && <p>No users found.</p>}

      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} onClick={() => handleSort(column)}>
                {column}
              </th>
            ))}
            {(userRole === 'admin' || userRole === 'editor') && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {table === 'records' &&
            records.map((record) => (
              <tr key={record.id}>
                {columns.map((column) => (
                  <td key={column}>{record.content[column]}</td>
                ))}
                {(userRole === 'admin' || userRole === 'editor') && (
                  <td>
                    <button onClick={() => handleEdit(record)}>Edit</button>
                    {userRole === 'admin' && (
                      <button onClick={() => handleDelete(record.id)}>Delete</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          {table === 'users' &&
            users.map((user) => (
              <tr key={user.id}>
                {columns.map((column) => (
                  <td key={column}>{(user as any)[column]}</td>
                ))}
                {(userRole === 'admin' || userRole === 'editor') && (
                  <td>
                    <button onClick={() => handleEditUser(user)}>Edit</button>
                    {userRole === 'admin' && (
                      <button onClick={() => handleDelete(user.id)}>Delete</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>
          Previous
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button onClick={() => setPage(page < totalPages ? page + 1 : totalPages)} disabled={page === totalPages}>
          Next
        </button>
      </div>
      {editRecord && table === 'records' && (
        <form onSubmit={handleUpdate}>
          <h2>Edit Record</h2>
          {columns.map((column) => (
            <div key={column}>
              <label>{column}</label>
              <input
                type="text"
                name={column}
                value={editRecord.content[column]}
                onChange={handleInputChange}
              />
            </div>
          ))}
          <button type="submit">Update Record</button>
        </form>
      )}
      {editUser && table === 'users' && (
        <form onSubmit={handleUpdate}>
          <h2>Edit User</h2>
          {columns.map((column) => (
            <div key={column}>
              <label>{column}</label>
              <input
                type="text"
                name={column}
                value={(editUser as any)[column]}
                onChange={handleInputChange}
              />
            </div>
          ))}
          <button type="submit">Update User</button>
        </form>
      )}
      {!showAddForm && <button onClick={() => setShowAddForm(true)}>Add Record</button>}
      {showAddForm && (
        <form onSubmit={handleAddRecord}>
          <h2>Add Record</h2>
          {columns.map((column) => (
            <div key={column}>
              <label>{column}</label>
              <input
                type="text"
                name={column}
                value={newRecord.content[column] || ''}
                onChange={handleNewInputChange}
              />
            </div>
          ))}
          <button type="submit">Add Record</button>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
