'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi, repsApi, SupportTicket, SupportRep } from '@/lib/adminApi';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Ticket, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  UserPlus,
  RefreshCw,
  LogOut
} from 'lucide-react';

export default function SupportPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (!token) {
      router.push('/support/login');
    } else {
      setIsAuthChecking(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user');
    document.cookie = 'session_token=; path=/; max-age=0';
    router.push('/support/login');
  };

  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['admin-tickets', statusFilter],
    queryFn: () => ticketsApi.getAll(statusFilter ? { status: statusFilter } : undefined).then(res => res.data),
    refetchInterval: 10000,
  });

  const { data: repsData } = useQuery({
    queryKey: ['admin-reps'],
    queryFn: () => repsApi.getAll({ is_active: true }).then(res => res.data),
  });

  const assignMutation = useMutation({
    mutationFn: ({ ticketId, repId }: { ticketId: number; repId: number }) =>
      ticketsApi.assign(ticketId, { rep_id: repId, assigned_by: 'admin' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: number; status: string }) =>
      ticketsApi.update(ticketId, { 
        status,
        ...(status === 'RESOLVED' ? { resolved_at: new Date().toISOString() } : {})
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
    },
    onError: (error: any) => {
      console.error('Status update failed:', error.response?.data || error.message);
      alert('Failed to update status: ' + (error.response?.data?.error || error.message));
    },
  });

  const tickets = ticketsData?.tickets || [];
  const reps = repsData?.reps || [];

  const stats = {
    open: tickets.filter((t: SupportTicket) => t.status === 'OPEN').length,
    inProgress: tickets.filter((t: SupportTicket) => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter((t: SupportTicket) => t.status === 'RESOLVED').length,
    total: tickets.length,
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-red-500/20 text-red-400 border-red-500/30',
      IN_PROGRESS: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      WAITING_USER: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
      CLOSED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'OPEN': return <AlertCircle className="w-4 h-4" />;
      case 'IN_PROGRESS': return <RefreshCw className="w-4 h-4" />;
      case 'RESOLVED': return <CheckCircle className="w-4 h-4" />;
      case 'CLOSED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="GhostWare" className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">GhostWare Support</h1>
                <p className="text-sm text-gray-400">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link
                href="/support/agent"
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Support Agents
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-gray-400">Open</span>
            </div>
            <div className="text-3xl font-bold text-red-400">{stats.open}</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">In Progress</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">{stats.inProgress}</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Resolved</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{stats.resolved}</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Ticket className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Total</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">{stats.total}</div>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              Support Tickets
            </h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_USER">Waiting User</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {ticketsLoading ? (
            <div className="text-center py-12 text-gray-400">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No tickets found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Query</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Assigned To</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Created</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket: SupportTicket) => {
                    const assignedRep = reps.find((r: SupportRep) => r.id === ticket.assigned_rep_id);
                    
                    return (
                      <tr key={ticket.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm text-purple-400">#{ticket.id}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium">@{ticket.telegram_username || 'unknown'}</div>
                            <div className="text-xs text-gray-500">{ticket.telegram_user_id}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 rounded-lg bg-gray-800 text-xs font-medium">
                            {ticket.product_type}
                          </span>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <div className="truncate text-sm text-gray-300">
                            {ticket.user_query}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 w-fit ${getStatusBadge(ticket.status)}`}>
                            {getStatusIcon(ticket.status)}
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={ticket.assigned_rep_id || ''}
                            onChange={(e) => {
                              const repId = Number(e.target.value);
                              if (repId) {
                                assignMutation.mutate({ ticketId: ticket.id, repId });
                              }
                            }}
                            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={assignMutation.isPending}
                          >
                            <option value="">Unassigned</option>
                            {reps.map((rep: SupportRep) => (
                              <option key={rep.id} value={rep.id}>
                                {rep.full_name} ({rep.current_load}/{rep.max_capacity})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-400">
                            {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/support/tickets/${ticket.id}`}
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
                            >
                              View
                            </Link>
                            <select
                              value={ticket.status}
                              onChange={(e) => {
                                updateStatusMutation.mutate({ 
                                  ticketId: ticket.id, 
                                  status: e.target.value 
                                });
                              }}
                              className="px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                              disabled={updateStatusMutation.isPending}
                            >
                              <option value="OPEN">Open</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="WAITING_USER">Waiting User</option>
                              <option value="RESOLVED">Resolved</option>
                              <option value="CLOSED">Closed</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
