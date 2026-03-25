import { api } from './test/setup.js';

describe('Health Check E2E Tests', () => {
  const ENDPOINT = '/api/v1';
  test('should perform health check', async () => {
    const response = await api.get(ENDPOINT);
    expect(response.status).toBe(200);
  });
});
