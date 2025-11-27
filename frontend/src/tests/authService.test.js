import { describe, it, expect, vi, beforeEach } from 'vitest';
import authService from '../services/authService';
import api from '../services/api';

// api 모듈 모킹
vi.mock('../services/api');

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login 호출 시 올바른 파라미터로 API를 호출해야 한다', async () => {
    const mockResponse = { data: { success: true, data: { accessToken: 'token' } } };
    api.post.mockResolvedValue(mockResponse);

    const email = 'test@example.com';
    const password = 'password';

    const result = await authService.login(email, password);

    expect(api.post).toHaveBeenCalledWith('/auth/login', { email, password });
    expect(result).toEqual(mockResponse.data);
  });

  it('register 호출 시 올바른 파라미터로 API를 호출해야 한다', async () => {
    const mockResponse = { data: { success: true } };
    api.post.mockResolvedValue(mockResponse);

    const email = 'test@example.com';
    const password = 'password';
    const username = 'testuser';

    const result = await authService.register(email, password, username);

    expect(api.post).toHaveBeenCalledWith('/auth/register', { email, password, username });
    expect(result).toEqual(mockResponse.data);
  });

  it('logout 호출 시 API를 호출해야 한다', async () => {
    const mockResponse = { data: { success: true } };
    api.post.mockResolvedValue(mockResponse);

    await authService.logout();

    expect(api.post).toHaveBeenCalledWith('/auth/logout');
  });
});
