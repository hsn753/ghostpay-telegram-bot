import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const ADMIN_API_KEY = process.env.NEXT_PUBLIC_ADMIN_API_KEY || '';

export const adminApi = axios.create({
  baseURL: API_URL + '/admin',
  headers: {
    'X-API-Key': ADMIN_API_KEY,
  },
});

export const publicApi = axios.create({
  baseURL: API_URL,
});

export const repsApi = {
  getAll: (params?: { is_active?: boolean; role?: string }) =>
    adminApi.get('/reps', { params }),
  getById: (id: number) => adminApi.get(`/reps/${id}`),
  create: (data: {
    telegram_user_id: string;
    telegram_username?: string;
    full_name: string;
    email?: string;
    role?: string;
    specializations?: string[];
    max_capacity?: number;
  }) => adminApi.post('/reps', data),
  update: (id: number, data: any) => adminApi.put(`/reps/${id}`, data),
  delete: (id: number) => adminApi.delete(`/reps/${id}`),
  getStats: (id: number) => adminApi.get(`/reps/${id}/stats`),
};

export const ticketsApi = {
  getAll: (params?: { status?: string; assigned_rep_id?: number; limit?: number; offset?: number }) =>
    adminApi.get('/tickets', { params }),
  getById: (id: number) => adminApi.get(`/tickets/${id}`),
  update: (id: number, data: { status?: string; assigned_to?: string }) =>
    adminApi.patch(`/tickets/${id}`, data),
  delete: (id: number) => adminApi.delete(`/tickets/${id}`),
  assign: (id: number, data: { rep_id: number; assigned_by: string; reason?: string }) =>
    adminApi.post(`/tickets/${id}/assign`, data),
  unassign: (id: number, data: { unassigned_by: string; reason: string }) =>
    adminApi.post(`/tickets/${id}/unassign`, data),
  sendMessage: (id: number, data: { sender_type: string; sender_id?: string; message: string }) =>
    adminApi.post(`/tickets/${id}/messages`, data),
  getMessages: (id: number) => adminApi.get(`/tickets/${id}/messages`),
  getAssignments: (id: number) => adminApi.get(`/tickets/${id}/assignments`),
};

export type SupportTicket = {
  id: number;
  telegram_user_id: string;
  telegram_username?: string;
  product_type: string;
  identifier_type: string;
  identifier_value: string;
  user_query: string;
  status: string;
  assigned_rep_id?: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
};

export type SupportRep = {
  id: number;
  telegram_user_id: string;
  telegram_username?: string;
  full_name: string;
  email?: string;
  role: string;
  is_active: boolean;
  specializations?: string;
  max_capacity: number;
  current_load: number;
  last_active_at?: string;
  created_at: string;
  updated_at: string;
};
