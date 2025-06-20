import { LoginCredentials, SignupCredentials, AuthResponse } from '@/types/auth';
import { API_ENDPOINTS } from '@/lib/constants';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.auth.signin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Login failed',
          error: data.error,
        };
      }

      return {
        success: true,
        message: 'Login successful',
        user: data.user,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: 'Network error',
      };
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.auth.signup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || data.message || 'Signup failed',
          error: data.error,
        };
      }

      return {
        success: true,
        message: 'Account created successfully',
        user: data.user,
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: 'Network error',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(API_ENDPOINTS.auth.signout, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (!response.ok || !data.user) {
        return {
          success: false,
          message: 'Not authenticated',
          error: 'No session found',
        };
      }

      return {
        success: true,
        message: 'User authenticated',
        user: data.user,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        message: 'Failed to get user session',
        error: 'Network error',
      };
    }
  }
}

export const authService = AuthService.getInstance(); 