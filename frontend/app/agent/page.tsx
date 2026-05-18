'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Ticket, MessageSquare, Send, LogOut, User } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function RepDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [walletSearch, setWalletSearch] = useState('');
  const [walletData, setWalletData] = useState<any>(null);
  const [showWalletLookup, setShowWalletLookup] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('session_token');
    
    if (!storedUser || !token) {
      router.push('/support/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'SUPPORT_REP') {
      router.push('/support');
      return;
    }

    setUser(userData);
  }, [router]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('session_token');
    return { Authorization: `Bearer ${token}` };
  };

  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['rep-tickets', user?.support_rep_id],
    queryFn: async () => {
      if (!user?.support_rep_id) return { tickets: [] };
      const response = await axios.get(
        `${API_URL}/admin/tickets?assigned_rep_id=${user.support_rep_id}`,
        { headers: { ...getAuthHeaders(), 'X-API-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY } }
      );
      return response.data;
    },
    enabled: !!user?.support_rep_id,
    refetchInterval: 5000, // More frequent refresh to catch reassignments
  });

  const { data: messagesData } = useQuery({
    queryKey: ['ticket-messages', selectedTicket?.id],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/admin/tickets/${selectedTicket.id}/messages`,
        { headers: { ...getAuthHeaders(), 'X-API-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY } }
      );
      return response.data;
    },
    enabled: !!selectedTicket,
    refetchInterval: 5000,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (msg: string) => {
      await axios.post(
        `${API_URL}/admin/tickets/${selectedTicket.id}/messages`,
        {
          sender_type: 'SUPPORT_REP',
          sender_id: user?.email,
          message: msg,
        },
        { headers: { ...getAuthHeaders(), 'X-API-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-messages', selectedTicket?.id] });
      setMessage('');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await axios.patch(
        `${API_URL}/admin/tickets/${selectedTicket.id}`,
        { status },
        { headers: { ...getAuthHeaders(), 'X-API-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY } }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Status update successful:', data);
      queryClient.invalidateQueries({ queryKey: ['rep-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket-messages'] });
    },
    onError: (error: any) => {
      console.error('Status update failed:', error.response?.data || error.message);
      alert('Failed to update status: ' + (error.response?.data?.error || error.message));
    },
  });

  const deleteTicketMutation = useMutation({
    mutationFn: async (ticketId: number) => {
      await axios.delete(
        `${API_URL}/admin/tickets/${ticketId}`,
        { headers: { ...getAuthHeaders(), 'X-API-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rep-tickets'] });
      setSelectedTicket(null);
    },
  });

  const handleWalletLookup = async () => {
    if (!walletSearch.trim()) return;
    
    try {
      const response = await axios.get(
        `${API_URL}/admin/lookup/wallet?wallet=${encodeURIComponent(walletSearch)}`,
        { headers: { ...getAuthHeaders(), 'X-API-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY } }
      );
      setWalletData(response.data);
      setShowWalletLookup(true);
    } catch (error) {
      console.error('Wallet lookup failed:', error);
      alert('Failed to lookup wallet data');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user');
    document.cookie = 'session_token=; path=/; max-age=0';
    router.push('/support/login');
  };

  const tickets = ticketsData?.tickets || [];
  const messages = messagesData?.messages || [];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-red-500/20 text-red-400 border-red-500/30',
      IN_PROGRESS: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      WAITING_USER: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
      CLOSED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (!user) {
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
                <p className="text-sm text-gray-400">Support Agent Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search wallet or transaction ID..."
                  value={walletSearch}
                  onChange={(e) => setWalletSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleWalletLookup()}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-80"
                />
                <button
                  onClick={handleWalletLookup}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
                >
                  🔍 Lookup
                </button>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {showWalletLookup && walletData && (
          <div className="mb-6 bg-gray-900/50 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">🔍 Wallet Lookup Results</h2>
              <button
                onClick={() => setShowWalletLookup(false)}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
              >
                Close
              </button>
            </div>
            
            <div className="mb-4">
              <span className="text-sm text-gray-400">Search Query:</span>
              <div className="text-xs font-mono text-purple-400 break-all">{walletData.wallet}</div>
              <div className="text-sm text-gray-500 mt-1">Total Records: {walletData.total_count}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2 text-blue-400">💰 Payments ({walletData.payments?.length || 0})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {walletData.payments?.slice(0, 5).map((p: any) => (
                    <div 
                      key={p.id || p.link_id} 
                      onClick={() => setSelectedTransaction(p)}
                      className="text-xs border-l-2 border-blue-500 pl-2 cursor-pointer hover:bg-gray-700/30 p-2 rounded transition-colors"
                    >
                      <div className="font-mono text-blue-300">{p.link_id || 'Payment Link'}</div>
                      <div className="text-gray-400">{p.amount_lamports ? (p.amount_lamports / 1e9 + ' SOL') : 'N/A'}</div>
                      <div className="text-gray-500">Status: {p.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2 text-green-400">🔄 Swaps ({walletData.swaps?.length || 0})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {walletData.swaps?.slice(0, 5).map((s: any) => (
                    <div 
                      key={s.id || s.houdini_id} 
                      onClick={() => setSelectedTransaction(s)}
                      className="text-xs border-l-2 border-green-500 pl-2 cursor-pointer hover:bg-gray-700/30 p-2 rounded transition-colors"
                    >
                      <div className="font-mono text-green-300">{s.houdini_id}</div>
                      <div className="text-gray-400">{s.amount_in} {s.asset_in} → {s.amount_out} {s.asset_out}</div>
                      <div className="text-gray-500">Status: {s.houdini_status_label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2 text-yellow-400">📤 Sends ({walletData.sends?.length || 0})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {walletData.sends?.slice(0, 5).map((s: any) => (
                    <div key={s.houdini_id} className="text-xs border-l-2 border-yellow-500 pl-2">
                      <div className="font-mono text-yellow-300">{s.houdini_id}</div>
                      <div className="text-gray-400">{s.amount} {s.asset}</div>
                      <div className="text-gray-500">Status: {s.status_label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1 space-y-4">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                My Assigned Tickets ({tickets.length})
              </h2>

              {isLoading ? (
                <div className="text-center py-8 text-gray-400">Loading...</div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No tickets assigned</div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket: any) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedTicket?.id === ticket.id
                          ? 'bg-purple-500/20 border-purple-500'
                          : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-sm text-purple-400">#{ticket.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="text-sm mb-1">
                        <span className="text-gray-400">@{ticket.telegram_username || 'unknown'}</span>
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-2">
                        {ticket.user_query}
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-2">
            {!selectedTicket ? (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
                <Ticket className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Select a ticket to view details and respond</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">Ticket #{selectedTicket.id}</h2>
                      <p className="text-sm text-gray-400">
                        {selectedTicket.product_type} · {selectedTicket.identifier_type}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => updateStatusMutation.mutate(e.target.value)}
                        className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm"
                        disabled={updateStatusMutation.isPending}
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="WAITING_USER">Waiting User</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-400">User:</span>
                      <div className="text-sm">@{selectedTicket.telegram_username || selectedTicket.telegram_user_id}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Query:</span>
                      <div className="p-3 bg-gray-800 rounded-lg text-sm mt-1">
                        {selectedTicket.user_query}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-400">Identifier:</span>
                      <div className="text-xs font-mono text-gray-500 break-all">
                        {selectedTicket.identifier_value}
                      </div>
                    </div>
                    
                    {selectedTicket.transaction_data && (
                      <div>
                        <span className="text-sm text-gray-400">Transaction Details:</span>
                        <div className="mt-2 p-3 bg-gradient-to-br from-purple-900/20 to-gray-800 border border-purple-500/20 rounded-lg space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Ghost ID:</span>
                            <span className="font-mono text-purple-400">{selectedTicket.transaction_data.houdini_id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className="font-semibold text-green-400">{selectedTicket.transaction_data.status_label}</span>
                          </div>
                          {selectedTicket.transaction_data.amount_in && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Amount:</span>
                              <span>{selectedTicket.transaction_data.amount_in} {selectedTicket.transaction_data.asset_in}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Conversation
                  </h3>

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
                              : 'bg-purple-900/30 ml-12 mr-0'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold text-gray-400">
                              {msg.sender_type === 'USER'
                                ? `@${selectedTicket.telegram_username}`
                                : msg.sender_type}
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
            )}
          </div>
        </div>
      </div>

      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedTransaction(null)}>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Transaction Details</h2>
              <button onClick={() => setSelectedTransaction(null)} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm">
                Close
              </button>
            </div>
            
            <div className="space-y-3">
              {Object.entries(selectedTransaction).map(([key, value]: [string, any]) => {
                if (key === 'record_type') return null;
                return (
                  <div key={key} className="grid grid-cols-3 gap-4 border-b border-gray-800 pb-2">
                    <div className="text-sm text-gray-400 capitalize">{key.replace(/_/g, ' ')}:</div>
                    <div className="col-span-2 text-sm font-mono break-all">
                      {value === null || value === undefined ? (
                        <span className="text-gray-600">null</span>
                      ) : typeof value === 'boolean' ? (
                        <span className={value ? 'text-green-400' : 'text-red-400'}>{value.toString()}</span>
                      ) : typeof value === 'object' ? (
                        <pre className="text-xs bg-gray-800 p-2 rounded overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
                      ) : (
                        <span className="text-gray-200">{value.toString()}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
