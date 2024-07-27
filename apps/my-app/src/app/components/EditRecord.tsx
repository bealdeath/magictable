import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface RecordParams extends Record<string, string | undefined> {
  id: string;
}

const EditRecord: React.FC = () => {
  const { id } = useParams<RecordParams>();
  const [content, setContent] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/tables/1/records/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        setContent(response.data.content);
      } catch (error) {
        console.error('Error fetching record:', error);
      }
    };

    fetchRecord();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/tables/1/records/${id}`, { content }, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  return (
    <div>
      <h1>Edit Record</h1>
      <label>Content: </label>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleUpdate}>Update Record</button>
    </div>
  );
};

export default EditRecord;
