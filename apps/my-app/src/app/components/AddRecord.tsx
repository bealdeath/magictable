import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface RecordParams extends Record<string, string | undefined> {
  tableId: string;
  recordId?: string;
}

const AddRecord: React.FC = () => {
  const { tableId, recordId } = useParams<RecordParams>();
  const [content, setContent] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecord = async () => {
      if (recordId) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/tables/${tableId}/records/${recordId}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        setContent(response.data.content);
      }
    };

    fetchRecord();
  }, [tableId, recordId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (recordId) {
        await axios.put(`http://localhost:5000/tables/${tableId}/records/${recordId}`, { content }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      } else {
        await axios.post(`http://localhost:5000/tables/${tableId}/records`, { content }, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  return (
    <div>
      <h1>{recordId ? 'Edit' : 'Add'} Record</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Content:
          <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
        </label>
        <button type="submit">{recordId ? 'Update' : 'Add'} Record</button>
      </form>
    </div>
  );
};

export default AddRecord;
