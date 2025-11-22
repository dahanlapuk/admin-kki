import { create } from 'zustand';
import apiClient from '../lib/api';

export interface ContentRequest {
  _id: string;
  ticketId: string;
  title: string;
  contentType: string;
  deadline: string;
  purpose: string;
  description: string;
  keyPoints: string[];
  targetAudience: string;
  publishPlatform: string[];
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  references?: string;
  requestedBy: any;
  assignedTo?: any;
  createdAt: string;
}

interface RequestState {
  requests: ContentRequest[];
  currentRequest: ContentRequest | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  fetchRequests: (page?: number, limit?: number, filters?: Record<string, any>) => Promise<void>;
  fetchRequest: (id: string) => Promise<void>;
  createRequest: (data: any) => Promise<void>;
  updateRequest: (id: string, data: any) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  validateRequest: (id: string) => Promise<void>;
  assignRequest: (id: string, assignedTo: any) => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
  setPage: (page: number) => void;
}

export const useRequestStore = create<RequestState>((set, get) => ({
  requests: [],
  currentRequest: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },

  setPage: (page: number) => {
    set({ pagination: { ...get().pagination, page } });
    get().fetchRequests(page);
  },

  fetchRequests: async (page = 1, limit = 12, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = { page, limit, ...filters };
      const response: any = await apiClient.get('/requests', params);
      set({
        requests: response.data.requests,
        pagination: {
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.pages,
          hasNextPage: response.data.pagination.hasNextPage,
          hasPrevPage: response.data.pagination.hasPrevPage,
        },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchRequest: async (id) => {
    set({ loading: true, error: null });
    try {
      const response: any = await apiClient.get(`/requests/${id}`);
      set({ currentRequest: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createRequest: async (data) => {
    set({ loading: true, error: null });
    try {
      await apiClient.post('/requests', data);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateRequest: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await apiClient.put(`/requests/${id}`, data);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteRequest: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiClient.delete(`/requests/${id}`);
      set((state) => ({
        requests: state.requests.filter((r) => r._id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  validateRequest: async (id) => {
    set({ loading: true, error: null });
    try {
      await apiClient.patch(`/requests/${id}/validate`);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  assignRequest: async (id, assignedTo) => {
    set({ loading: true, error: null });
    try {
      await apiClient.patch(`/requests/${id}/assign`, { assignedTo });
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      await apiClient.patch(`/requests/${id}/status`, { status });
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
