import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Users,
  Search,
  Plus,
  Pencil,
  X,
  Loader2,
  Download,
  Mail,
  Phone,
  ShoppingCart,
  DollarSign,
} from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

interface Order {
  id: string;
  customer_email: string;
  total: number;
  status: string;
  created_at: string;
}

type SortOption = 'name' | 'total_spent' | 'created_at';

export default function CustomersManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('created_at');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [customersRes, ordersRes] = await Promise.all([
      supabase.from('customers').select('id, email, name, phone, total_orders, total_spent, created_at'),
      supabase.from('orders').select('id, customer_email, total, status, created_at'),
    ]);
    if (!customersRes.error) setCustomers(customersRes.data ?? []);
    if (!ordersRes.error) setOrders(ordersRes.data ?? []);
    setLoading(false);
  };

  // Compute order counts per customer email from orders table
  const orderCountMap = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.customer_email] = (acc[order.customer_email] || 0) + 1;
    return acc;
  }, {});

  // Stats
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
  const avgOrderValue = totalRevenue > 0 && customers.reduce((sum, c) => sum + (c.total_orders || 0), 0) > 0
    ? totalRevenue / customers.reduce((sum, c) => sum + (c.total_orders || 0), 0)
    : 0;

  // Filter
  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'total_spent') return (b.total_spent || 0) - (a.total_spent || 0);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Add customer
  const handleAdd = async () => {
    if (!addForm.email.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('customers').insert({
      name: addForm.name.trim(),
      email: addForm.email.trim(),
      phone: addForm.phone.trim(),
      total_orders: 0,
      total_spent: 0,
    });
    setSaving(false);
    if (error) {
      alert('Error adding customer: ' + error.message);
      return;
    }
    setAddForm({ name: '', email: '', phone: '' });
    setShowAddModal(false);
    fetchData();
  };

  // Inline edit
  const startEdit = (c: Customer) => {
    setEditingId(c.id);
    setEditForm({ name: c.name || '', email: c.email || '', phone: c.phone || '' });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    const { error } = await supabase
      .from('customers')
      .update({ name: editForm.name, email: editForm.email, phone: editForm.phone })
      .eq('id', id);
    setSaving(false);
    if (error) {
      alert('Error updating customer: ' + error.message);
      return;
    }
    setEditingId(null);
    fetchData();
  };

  const cancelEdit = () => setEditingId(null);

  // Detail modal
  const openDetail = (c: Customer) => {
    setSelectedCustomer(c);
    setEditForm({ name: c.name || '', email: c.email || '', phone: c.phone || '' });
    setShowDetailModal(true);
  };

  const saveDetailEdit = async () => {
    if (!selectedCustomer) return;
    setSaving(true);
    const { error } = await supabase
      .from('customers')
      .update({ name: editForm.name, email: editForm.email, phone: editForm.phone })
      .eq('id', selectedCustomer.id);
    setSaving(false);
    if (error) {
      alert('Error updating customer: ' + error.message);
      return;
    }
    setShowDetailModal(false);
    setSelectedCustomer(null);
    fetchData();
  };

  const customerOrders = selectedCustomer
    ? orders.filter((o) => o.customer_email === selectedCustomer.email)
    : [];

  // CSV export
  const exportCSV = () => {
    const header = 'Name,Email,Phone,Orders,Total Spent,Joined Date';
    const rows = sorted.map((c) =>
      [
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${(c.phone || '').replace(/"/g, '""')}"`,
        orderCountMap[c.email] || c.total_orders || 0,
        (c.total_spent || 0).toFixed(2),
        new Date(c.created_at).toLocaleDateString(),
      ].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-pink-500" />
          Customers
        </h1>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-4 py-2 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <div className="p-3 bg-pink-100 rounded-lg">
            <Users className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold">{totalCustomers}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <div className="p-3 bg-pink-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">{fmt(totalRevenue)}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <div className="p-3 bg-pink-100 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Average Order Value</p>
            <p className="text-2xl font-bold">{fmt(avgOrderValue)}</p>
          </div>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="name">Sort by Name</option>
          <option value="total_spent">Sort by Total Spent</option>
          <option value="created_at">Sort by Date Joined</option>
        </select>
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-lg">No customers yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Phone</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Orders</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Total Spent</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Joined Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                  {editingId === c.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">{orderCountMap[c.email] || c.total_orders || 0}</td>
                      <td className="px-4 py-3 text-sm">{fmt(c.total_spent || 0)}</td>
                      <td className="px-4 py-3 text-sm">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => saveEdit(c.id)}
                            disabled={saving}
                            className="px-3 py-1 text-xs bg-pink-500 text-white rounded hover:bg-pink-600 disabled:opacity-50"
                          >
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        className="px-4 py-3 text-sm font-medium cursor-pointer hover:text-pink-500"
                        onClick={() => openDetail(c)}
                      >
                        {c.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{c.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{c.phone || '—'}</td>
                      <td className="px-4 py-3 text-sm">{orderCountMap[c.email] || c.total_orders || 0}</td>
                      <td className="px-4 py-3 text-sm">{fmt(c.total_spent || 0)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => startEdit(c)}
                          className="p-1 text-gray-400 hover:text-pink-500 transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4">Add Customer</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving || !addForm.email.trim()}
                className="px-4 py-2 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 flex items-center gap-1"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => {
                setShowDetailModal(false);
                setSelectedCustomer(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold mb-5">Customer Details</h2>

            {/* Editable Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-pink-500 shrink-0" />
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Name"
                />
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-pink-500 shrink-0" />
                <input
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Email"
                />
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-pink-500 shrink-0" />
                <input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Phone"
                />
              </div>
              <button
                onClick={saveDetailEdit}
                disabled={saving}
                className="px-4 py-2 text-sm bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 flex items-center gap-1"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </div>

            {/* Total Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-pink-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-xl font-bold text-pink-600">
                  {orderCountMap[selectedCustomer.email] || selectedCustomer.total_orders || 0}
                </p>
              </div>
              <div className="bg-pink-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-xl font-bold text-pink-600">{fmt(selectedCustomer.total_spent || 0)}</p>
              </div>
            </div>

            {/* Order History */}
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-pink-500" />
              Order History
            </h3>
            {customerOrders.length === 0 ? (
              <p className="text-sm text-gray-400">No orders found for this customer.</p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-3 py-2 font-medium text-gray-600">Order ID</th>
                      <th className="px-3 py-2 font-medium text-gray-600">Date</th>
                      <th className="px-3 py-2 font-medium text-gray-600">Status</th>
                      <th className="px-3 py-2 font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((o) => (
                      <tr key={o.id} className="border-b last:border-b-0">
                        <td className="px-3 py-2 font-mono text-xs">{o.id.slice(0, 8)}...</td>
                        <td className="px-3 py-2">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="px-3 py-2">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {o.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">{fmt(o.total || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
