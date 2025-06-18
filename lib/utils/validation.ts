import { VALIDATION } from '@/lib/constants';

export const validationUtils = {
  email: {
    isValid: (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email) && 
             email.length >= VALIDATION.email.minLength && 
             email.length <= VALIDATION.email.maxLength;
    },
    getError: (email: string): string | null => {
      if (!email) return 'Email is required';
      if (email.length < VALIDATION.email.minLength) return 'Email is too short';
      if (email.length > VALIDATION.email.maxLength) return 'Email is too long';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
      return null;
    }
  },

  password: {
    isValid: (password: string): boolean => {
      return password.length >= VALIDATION.password.minLength && 
             password.length <= VALIDATION.password.maxLength;
    },
    getError: (password: string): string | null => {
      if (!password) return 'Password is required';
      if (password.length < VALIDATION.password.minLength) return 'Password must be at least 6 characters';
      if (password.length > VALIDATION.password.maxLength) return 'Password is too long';
      return null;
    }
  },

  confirmPassword: {
    isValid: (password: string, confirmPassword: string): boolean => {
      return password === confirmPassword;
    },
    getError: (password: string, confirmPassword: string): string | null => {
      if (!confirmPassword) return 'Please confirm your password';
      if (password !== confirmPassword) return 'Passwords do not match';
      return null;
    }
  },

  notes: {
    isValid: (notes: string): boolean => {
      return notes.length <= VALIDATION.notes.maxLength;
    },
    getError: (notes: string): string | null => {
      if (notes.length > VALIDATION.notes.maxLength) return 'Notes are too long';
      return null;
    }
  },

  date: {
    isValid: (date: string): boolean => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    getError: (date: string): string | null => {
      if (!date) return 'Date is required';
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) return 'Date cannot be in the past';
      return null;
    }
  },

  amount: {
    isValid: (amount: number): boolean => {
      return amount > 0 && amount <= 10000;
    },
    getError: (amount: number): string | null => {
      if (amount <= 0) return 'Amount must be greater than 0';
      if (amount > 10000) return 'Amount cannot exceed $10,000';
      return null;
    }
  }
}; 