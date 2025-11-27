import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAuthStore from '../stores/authStore';
import authService from '../services/authService';
import * as tokenManager from '../utils/tokenManager';

// 의존성 모킹
vi.mock('../services/authService');
vi.mock('../utils/tokenManager');

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
    vi.clearAllMocks();
  });

  it('초기 상태가 올바른지 확인한다', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('로그인 성공 시 상태와 토큰을 업데이트해야 한다', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockResponse = {
      data: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser
      }
    };
    authService.login.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(tokenManager.setAccessToken).toHaveBeenCalledWith('access-token');
    expect(tokenManager.setRefreshToken).toHaveBeenCalledWith('refresh-token');
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('로그인 실패 시 에러 상태를 업데이트해야 한다', async () => {
    const errorMessage = 'Invalid credentials';
    const mockError = {
      response: {
        data: {
          error: {
            message: errorMessage
          }
        }
      }
    };
    authService.login.mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthStore());

    await expect(
      act(async () => {
        await result.current.login('test@example.com', 'wrong-password');
      })
    ).rejects.toEqual(mockError);

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.isLoading).toBe(false);
  });

  it('로그아웃 시 토큰을 지우고 상태를 초기화해야 한다', async () => {
    // 초기 로그인 상태 설정
    useAuthStore.setState({ user: { id: 1 }, isAuthenticated: true });
    authService.logout.mockResolvedValue({});

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.logout();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(tokenManager.clearTokens).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
