'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketsApi, repsApi } from '@/lib/adminApi';
import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Send, 
  Clock, 
  User,
  Tag,
  MessageSquare,
  CheckCircle,
  History
} from 'lucide-react';

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticketId = parseInt(params.id);
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');

  const { data: ticketData } = useQuery({
    queryKey: ['admin-ticket', ticketId],
    queryFn: () => ticketsApi.getById(ticketId).then(res => res.data),
    refetchInterval: 5000,
  });

  const { data: messagesData } = useQuery({
    queryKey: ['admin-ticket-messages', ticketId],
    queryFn: () => ticketsApi.getMessages(ticketId).then(res => res.data),
    refetchInterval: 5000,
  });

  const { data: assignmentsData } = useQuery({
    queryKey: ['admin-ticket-assignments', ticketId],
    queryFn: () => ticketsApi.getAssignments(ticketId).then(res => res.data),
  });

  const { data: repsData } = useQuery({
    queryKey: ['admin-reps'],
    queryFn: () => repsApi.getAll({ is_active: true }).then(res => res.data),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (msg: string) =>
      ticketsApi.sendMessage(ticketId, {
        sender_type: 'ADMIN',
        sender_id: 'admin',
        message: msg,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ticket-messages', ticketId] });
      setMessage('');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) =>
      ticketsApi.update(ticketId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
    },
  });

  const assignMutation = useMutation({
    mutationFn: (repId: number) =>
      ticketsApi.assign(ticketId, { rep_id: repId, assigned_by: 'admin' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['admin-ticket-assignments', ticketId] });
    },
  });

  const deleteTicketMutation = useMutation({
    mutationFn: () => ticketsApi.delete(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      window.location.href = '/support';
    },
  });

  const ticket = ticketData?.ticket;
  const messages = messagesData?.messages || [];
  const assignments = assignmentsData?.history || [];
  const reps = repsData?.reps || [];

  if (!ticket) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎫</div>
          <p className="text-gray-400">Loading ticket...</p>
        </div>
      </div>
    );
  }

  const assignedRep = reps.find((r: any) => r.id === ticket.assigned_rep_id);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'text-red-400 bg-red-500/20 border-red-500/30',
      IN_PROGRESS: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
      WAITING_USER: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
      RESOLVED: 'text-green-400 bg-green-500/20 border-green-500/30',
      CLOSED: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
    };
    return colors[status] || 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/support"
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Ticket #{ticket.id}</h1>
                <p className="text-sm text-gray-400">
                  Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={ticket.status}
                onChange={(e) => updateStatusMutation.mutate(e.target.value)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={updateStatusMutation.isPending}
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="WAITING_USER">Waiting User</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
                    deleteTicketMutation.mutate();
                  }
                }}
                disabled={deleteTicketMutation.isPending}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium"
              >
                {deleteTicketMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Ticket Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">User</label>
                  <div className="mt-1">
                    <div className="font-medium">@{ticket.telegram_username || 'unknown'}</div>
                    <div className="text-sm text-gray-500">{ticket.telegram_user_id}</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Product Type</label>
                  <div className="mt-1">
                    <span className="px-3 py-1 rounded-lg bg-gray-800 text-sm font-medium">
                      {ticket.product_type}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Identifier</label>
                  <div className="mt-1">
                    <div className="text-sm">{ticket.identifier_type}</div>
                    <div className="text-xs text-gray-500 font-mono break-all">{ticket.identifier_value}</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">User Query</label>
                  <div className="mt-1 p-3 bg-gray-800 rounded-lg text-sm">
                    {ticket.user_query}
                  </div>
                </div>
                
                {ticket.transaction_data && (
                  <div>
                    <label className="text-sm text-gray-400">Transaction Details</label>
                    <div className="mt-1 p-4 bg-gradient-to-br from-purple-900/20 to-gray-800 border border-purple-500/20 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Ghost ID:</span>
                        <span className="text-xs font-mono text-purple-400">{ticket.transaction_data.houdini_id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Status:</span>
                        <span className="text-xs font-semibold text-green-400">{ticket.transaction_data.status_label}</span>
                      </div>
                      {ticket.transaction_data.amount_in && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Amount In:</span>
                          <span className="text-xs font-medium">{ticket.transaction_data.amount_in} {ticket.transaction_data.asset_in}</span>
                        </div>
                      )}
                      {ticket.transaction_data.amount_out && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Amount Out:</span>
                          <span className="text-xs font-medium">{ticket.transaction_data.amount_out} {ticket.transaction_data.asset_out}</span>
                        </div>
                      )}
                      {ticket.transaction_data.payer_address && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Sender:</span>
                          <span className="text-xs font-mono text-gray-500 truncate max-w-[200px]">{ticket.transaction_data.payer_address}</span>
                        </div>
                      )}
                      {ticket.transaction_data.receiver_address && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Receiver:</span>
                          <span className="text-xs font-mono text-gray-500 truncate max-w-[200px]">{ticket.transaction_data.receiver_address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conversation
              </h2>
              
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No messages yet</p>
                ) : (
                  messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-lg ${
                        msg.sender_type === 'USER'
                          ? 'bg-gray-800 ml-0 mr-12'
                          : msg.sender_type === 'ADMIN'
                          ? 'bg-purple-900/30 ml-12 mr-0'
                          : 'bg-gray-700/30 mx-12'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-gray-400">
                          {msg.sender_type === 'USER' ? `@${ticket.telegram_username}` : msg.sender_type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && message.trim()) {
                      sendMessageMutation.mutate(message);
                    }
                  }}
                  placeholder="Type your response..."
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => message.trim() && sendMessageMutation.mutate(message)}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Status
              </h3>
              <span className={`px-4 py-2 rounded-full text-sm font-medium border inline-flex items-center gap-2 ${getStatusColor(ticket.status)}`}>
                <CheckCircle className="w-4 h-4" />
                {ticket.status.replace('_', ' ')}
              </span>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="w-4 h-4" />
                Assigned To
              </h3>
              <select
                value={ticket.assigned_rep_id || ''}
                onChange={(e) => {
                  const repId = Number(e.target.value);
                  if (repId) {
                    assignMutation.mutate(repId);
                  }
                }}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={assignMutation.isPending}
              >
                <option value="">Unassigned</option>
                {reps.map((rep: any) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.full_name} ({rep.current_load}/{rep.max_capacity})
                  </option>
                ))}
              </select>
              {assignedRep && (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                  <div className="text-sm font-medium">{assignedRep.full_name}</div>
                  <div className="text-xs text-gray-400">@{assignedRep.telegram_username}</div>
                  <div className="text-xs text-gray-500 mt-1">{assignedRep.role}</div>
                </div>
              )}
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timeline
              </h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="text-gray-400">Created</div>
                  <div>{format(new Date(ticket.created_at), 'PPp')}</div>
                </div>
                {ticket.resolved_at && (
                  <div className="text-sm">
                    <div className="text-gray-400">Resolved</div>
                    <div>{format(new Date(ticket.resolved_at), 'PPp')}</div>
                  </div>
                )}
              </div>
            </div>

            {assignments.length > 0 && (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Assignment History
                </h3>
                <div className="space-y-3">
                  {assignments.map((assignment: any) => (
                    <div key={assignment.id} className="text-sm border-l-2 border-purple-500 pl-3">
                      <div className="font-medium">{assignment.rep_name}</div>
                      <div className="text-xs text-gray-400">
                        by {assignment.assigned_by}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(assignment.assigned_at), { addSuffix: true })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
