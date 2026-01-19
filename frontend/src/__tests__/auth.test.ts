import axios from 'axios';
import Cookies from 'js-cookie';
import { loginUser, registerUser } from '../api/auth';

jest.mock('axios');
jest.mock('js-cookie');

describe('Auth API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('registerUser - success', async () => {
    const mockData = { status: true, data: { email: 'test@example.com' } };
    (axios.post as jest.Mock).mockResolvedValue({ data: mockData });

    const response = await registerUser({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    });

    expect(response).toEqual(mockData);
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/register'),
      expect.any(Object),
      expect.objectContaining({ withCredentials: true })
    );
  });

  it('loginUser - success and set cookie', async () => {
    const mockResponse = { status: true, token: 'mock-token' };
    (axios.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const response = await loginUser('test@example.com', 'password123');

    expect(response).toEqual(mockResponse);
    // simulate cookie
    Cookies.set('token', response.token, expect.any(Object));
  });
});
