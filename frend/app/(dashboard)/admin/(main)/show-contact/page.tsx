'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Trash2,
  Eye,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Inbox,
  X,
  Send,
  CheckCircle,
} from 'lucide-react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  reply_message?: string | null;
  replied_at?: string | null;
  created_at: string;
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // حالات الرد
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ;

  // 1. جلب الرسائل
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/contact/admin/all`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 2. تحديث حالة الرسالة
  const handleStatusChange = async (id: number, newStatus: 'unread' | 'read' | 'replied') => {
    try {
      const res = await fetch(`${API_URL}/api/contact/admin/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // 3. حذف رسالة
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`${API_URL}/api/contact/admin/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  // 4. فتح الرسالة وتمييزها كمقروءة تلقائياً
  const handleViewMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setReplyText('');
    if (msg.status === 'unread') {
      handleStatusChange(msg.id, 'read');
    }
  };

  // 5. إرسال الرد عبر Resend
  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const res = await fetch(`${API_URL}/api/contact/admin/${selectedMessage.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          replyText: replyText.trim(),
          userEmail: selectedMessage.email,
          userName: selectedMessage.name,
          originalSubject: selectedMessage.subject,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Email sent successfully via Resend!');
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === selectedMessage.id
              ? {
                  ...msg,
                  status: 'replied',
                  reply_message: replyText.trim(),
                  replied_at: new Date().toISOString(),
                }
              : msg
          )
        );
        setSelectedMessage(null);
        setReplyText('');
      } else {
        alert(data.message || 'Failed to send reply');
      }
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Failed to send reply. Please check server logs.');
    } finally {
      setSendingReply(false);
    }
  };

  // تصفية وبحث
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || msg.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-[#001F24] flex items-center gap-2">
              <Inbox className="w-6 h-6 text-[#00535B]" /> Contact Messages
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Review inquiries and send direct email replies to users.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-[#E6F4F1] text-[#00535B] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#A9ECE5]">
              Total: {messages.length}
            </span>
            <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-amber-200">
              Unread: {messages.filter((m) => m.status === 'unread').length}
            </span>
            <button
              onClick={fetchMessages}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search sender, email, content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00535B]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
              <option value="replied">Replied Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-slate-400 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#00535B]" />
              <p className="text-sm">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-16 text-center text-slate-400">No messages found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Sender</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        msg.status === 'unread' ? 'bg-[#EDFCFF]/40 font-medium' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{msg.name}</div>
                        <div className="text-xs text-slate-500">{msg.email}</div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="text-slate-800 capitalize font-medium">{msg.subject}</div>
                        <div className="text-xs text-slate-500 truncate">{msg.message}</div>
                      </td>
                      <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            msg.status === 'unread'
                              ? 'bg-amber-100 text-amber-800'
                              : msg.status === 'replied'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {msg.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewMessage(msg)}
                            className="p-1.5 text-slate-600 hover:text-[#00535B] hover:bg-slate-100 rounded-lg transition"
                            title="View / Reply"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: عرض الرسالة + نموذج الرد عبر Resend */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedMessage.subject}</h3>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sender Details */}
              <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-700">{selectedMessage.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${selectedMessage.email}`} className="text-[#00535B] hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Message:</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Previous Reply if exists */}
              {selectedMessage.reply_message && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Already Replied:
                  </div>
                  <p className="text-xs text-emerald-700 whitespace-pre-wrap">
                    {selectedMessage.reply_message}
                  </p>
                </div>
              )}

              {/* Reply Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-semibold text-slate-700">
                  {selectedMessage.reply_message ? 'Send Another Reply:' : 'Reply to User:'}
                </label>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write your response to ${selectedMessage.name}...`}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#00535B]"
                />
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500 font-medium">Status:</label>
                    <select
                      value={selectedMessage.status}
                      onChange={(e) =>
                        handleStatusChange(
                          selectedMessage.id,
                          e.target.value as 'unread' | 'read' | 'replied'
                        )
                      }
                      className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 font-medium focus:outline-none"
                    >
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    disabled={sendingReply || !replyText.trim()}
                    onClick={handleSendReply}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00535B] hover:bg-[#003d42] text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {sendingReply ? 'Sending via Resend...' : 'Send Reply via Email'}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}