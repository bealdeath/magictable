import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface DashboardProps {
  userRole: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({ firstName: '', lastName: '', email: '', role: '' });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [role, setRole] = useState<string>(userRole);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        setRole(userRole);
        console.log('User role:', userRole);
        const response = await axios.get('http://localhost:5000/api/data', {
          headers: { 'Authorization': 'Bearer ' + token },
          params: { sortField, sortOrder, page, search }
        });
        const fetchedColumns = Object.keys(response.data.users[0]).filter(column => !['isAdmin', 'password', 'id', 'createdAt', 'updatedAt'].includes(column));
        setColumns(fetchedColumns);
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Error fetching data');
      }
    };

    fetchData();
  }, [sortField, sortOrder, page, search, userRole]);

  const handleSort = (field: string) => {
    const order = sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setSortField(field);
    setSortOrder(order);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/tables/1/records/${id}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      setUsers(users.filter(user => user.id !== id));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/tables/1/records/${editUser?.id}`, editUser, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      setEditUser(null);
      const updatedUsers = users.map(user => (user.id === editUser?.id ? editUser : user));
      setUsers(updatedUsers);
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditUser(editUser => (editUser ? { ...editUser, [name]: value } : null));
  };

  const handleNewInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleAddRecord = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/tables/1/records', newUser, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      setUsers([...users, response.data]);
      setNewUser({ firstName: '', lastName: '', email: '', role: '' });
      setShowAddForm(false);
      alert('User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user');
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <label>Search: </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div>
        <label>Sort Field: </label>
        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          {columns.map(column => (
            <option key={column} value={column}>{column}</option>
          ))}
        </select>
        <label>Sort Order: </label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
        <button onClick={() => { }}>Apply Sort</button>
      </div>

      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column} onClick={() => handleSort(column)}>{column}</th>
            ))}
            {(role === 'admin' || role === 'editor') && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              {columns.map(column => (
                <td key={column}>{user[column]}</td>
              ))}
              {(role === 'admin' || role === 'editor') && (
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  {role === 'admin' && <button onClick={() => handleDelete(user.id)}>Delete</button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1}>Previous</button>
        <span>{page} / {totalPages}</span>
        <button onClick={() => setPage(page < totalPages ? page + 1 : totalPages)} disabled={page === totalPages}>Next</button>
      </div>
      {editUser && (
        <form onSubmit={handleUpdate}>
          <h2>Edit Record</h2>
          {columns.map(column => (
            <div key={column}>
              <label>{column}</label>
              <input
                type="text"
                name={column}
                value={editUser[column]}
                onChange={handleInputChange}
              />
            </div>
          ))}
          <button type="submit">Update Record</button>
        </form>
      )}
      {!showAddForm && (
        <button onClick={() => setShowAddForm(true)}>Add Record</button>
      )}
      {showAddForm && (
        <form onSubmit={handleAddRecord}>
          <h2>Add Record</h2>
          {columns.map(column => (
            <div key={column}>
              <label>{column}</label>
              <input
                type="text"
                name={column}
                value={newUser[column]}
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
