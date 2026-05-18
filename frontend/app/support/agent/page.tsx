'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repsApi, SupportRep } from '@/lib/adminApi';
import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  UserX,
  Shield,
  Star,
  TrendingUp,
  Activity,
  Mail,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

export default function RepsPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRep, setNewRep] = useState({
    telegram_user_id: '',
    telegram_username: '',
    full_name: '',
    email: '',
    max_capacity: 10,
  });

  const { data: repsData, isLoading } = useQuery({
    queryKey: ['admin-reps'],
    queryFn: () => repsApi.getAll().then(res => res.data),
    refetchInterval: 15000,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof newRep) => repsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reps'] });
      setShowAddModal(false);
      setNewRep({
        telegram_user_id: '',
        telegram_username: '',
        full_name: '',
        email: '',
        max_capacity: 10,
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      repsApi.update(id, { is_active: !is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reps'] });
    },
  });

  const reps = repsData?.reps || [];
  const activeReps = reps.filter((r: SupportRep) => r.is_active);


  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="GhostWare" className="h-8 w-8" />
              <div>
                <h1 className="text-3xl font-bold">Manage Support Agents</h1>
                <p className="text-gray-400 text-sm mt-1">
                  View and manage all support agents
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Agent
              </button>
              <Link
                href="/support"
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Total Reps</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">{reps.length}</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Active Reps</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{activeReps.length}</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Total Capacity</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {activeReps.reduce((sum: number, r: SupportRep) => sum + r.max_capacity, 0)}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Loading reps...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reps.map((rep: SupportRep) => (
              <div
                key={rep.id}
                className={`bg-gray-900/50 border rounded-xl p-6 ${
                  rep.is_active ? 'border-gray-800' : 'border-gray-800/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      rep.is_active ? 'bg-purple-500/20' : 'bg-gray-700'
                    }`}>
                      <Users className={`w-6 h-6 ${rep.is_active ? 'text-purple-400' : 'text-gray-500'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{rep.full_name}</h3>
                      <p className="text-xs text-gray-500">Support Agent · ID: {rep.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">@{rep.telegram_username || 'N/A'}</span>
                  </div>
                  {rep.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400 truncate">{rep.email}</span>
                    </div>
                  )}
                </div>


                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div>
                    <p className="text-xs text-gray-500">Load</p>
                    <p className="text-sm font-semibold">
                      {rep.current_load} / {rep.max_capacity}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleActiveMutation.mutate({ id: rep.id, is_active: rep.is_active })}
                    className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                      rep.is_active
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    disabled={toggleActiveMutation.isPending}
                  >
                    {rep.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New Support Agent</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Telegram User ID *</label>
                <input
                  type="text"
                  value={newRep.telegram_user_id}
                  onChange={(e) => setNewRep({ ...newRep, telegram_user_id: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telegram Username</label>
                <input
                  type="text"
                  value={newRep.telegram_username}
                  onChange={(e) => setNewRep({ ...newRep, telegram_username: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newRep.full_name}
                  onChange={(e) => setNewRep({ ...newRep, full_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  value={newRep.email}
                  onChange={(e) => setNewRep({ ...newRep, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Max Capacity</label>
                <input
                  type="number"
                  value={newRep.max_capacity}
                  onChange={(e) => setNewRep({ ...newRep, max_capacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                  max="50"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => createMutation.mutate(newRep)}
                disabled={!newRep.telegram_user_id || !newRep.full_name || !newRep.email || createMutation.isPending}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Rep'}
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
