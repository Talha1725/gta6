import { Preorder, PreorderCreateRequest, PreorderResponse } from '@/types/preorder';
import { API_ENDPOINTS } from '@/lib/constants';

export class PreorderService {
  private static instance: PreorderService;

  private constructor() {}

  public static getInstance(): PreorderService {
    if (!PreorderService.instance) {
      PreorderService.instance = new PreorderService();
    }
    return PreorderService.instance;
  }

  async createPreorder(request: PreorderCreateRequest): Promise<PreorderResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.admin.generatePreorder, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to create preorder',
          error: data.error,
        };
      }

      return {
        success: true,
        message: 'Preorder created successfully',
        preorder: data.preorder,
      };
    } catch (error) {
      console.error('Create preorder error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: 'Network error',
      };
    }
  }

  async getLatestPreorder(): Promise<Preorder | null> {
    try {
      const response = await fetch(API_ENDPOINTS.preorders.latest);
      
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.preorder || null;
    } catch (error) {
      console.error('Get latest preorder error:', error);
      return null;
    }
  }

  async getAllPreorders(): Promise<Preorder[]> {
    try {
      const response = await fetch(API_ENDPOINTS.admin.preorders);
      
      if (!response.ok) {
        throw new Error('Failed to fetch preorders');
      }

      return await response.json();
    } catch (error) {
      console.error('Get all preorders error:', error);
      throw error;
    }
  }

  async getPreorderById(id: number): Promise<Preorder | null> {
    try {
      const response = await fetch(`${API_ENDPOINTS.admin.preorders}/${id}`);
      
      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Get preorder by ID error:', error);
      return null;
    }
  }

  async updatePreorder(id: number, updates: Partial<Preorder>): Promise<PreorderResponse> {
    try {
      const response = await fetch(`${API_ENDPOINTS.admin.preorders}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to update preorder',
          error: data.error,
        };
      }

      return {
        success: true,
        message: 'Preorder updated successfully',
        preorder: data.preorder,
      };
    } catch (error) {
      console.error('Update preorder error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: 'Network error',
      };
    }
  }

  async deletePreorder(id: number): Promise<PreorderResponse> {
    try {
      const response = await fetch(`${API_ENDPOINTS.admin.preorders}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        return {
          success: false,
          message: data.error || 'Failed to delete preorder',
          error: data.error,
        };
      }

      return {
        success: true,
        message: 'Preorder deleted successfully',
      };
    } catch (error) {
      console.error('Delete preorder error:', error);
      return {
        success: false,
        message: 'An unexpected error occurred',
        error: 'Network error',
      };
    }
  }
}

export const preorderService = PreorderService.getInstance(); 