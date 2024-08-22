import request from 'supertest';
import app from '../apps/api/src/main.ts'; // Adjust the path to your Express app
import { describe, it, expect } from '@jest/globals';

describe('User Role Access', () => {
  it('should allow admin to delete a record', async () => {
    const token = 'YOUR_ADMIN_JWT'; // Replace with a valid admin JWT
    const res = await request(app)
      .delete('/api/users/1')  // Change this to a valid endpoint
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
  });

  it('should prevent editor from deleting a record', async () => {
    const token = 'YOUR_EDITOR_JWT'; // Replace with a valid editor JWT
    const res = await request(app)
      .delete('/api/users/1')  // Change this to a valid endpoint
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(403);  // Forbidden
  });
});
