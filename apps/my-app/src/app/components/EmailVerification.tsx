import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      axios.post('http://localhost:5000/verify-email', { token })
        .then(response => setMessage(response.data.message))
        .catch(() => setMessage('Error verifying email'));
    }
  }, [searchParams]);

  return (
    <div>
      <h1>Email Verification</h1>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmailVerification;
