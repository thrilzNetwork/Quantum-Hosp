import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';

interface Promotion {
  id: string;
  code: string;
  description: string | null;
  discount_percent: number;
  active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
}

interface PromotionForm {
  code: string;
  description: string;
  discount_percent: string;
  active: boolean;
  starts_at: string;
  expires_at: string;
}

const emptyForm: PromotionForm = {
  code: '',
  description: '',
  discount_percent: '',
  active: true,
  starts_at: '',
  expires_at: '',
};

export default function PromotionsManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PromotionForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setPromotions(data ?? []);
    setLoading(false);
  };

  const toDatetimeLocal = (iso: string | null): string => {
    if (!iso) return '';
    try {
      return new Date(iso).toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (promo: Promotion) => {
    setForm({
      code: promo.code,
      description: promo.description ?? '',
      discount_percent: String(promo.discount_percent),
      active: promo.active,
      starts_at: toDatetimeLocal(promo.starts_at),
      expires_at: toDatetimeLocal(promo.expires_at),
    });
    setEditingId(promo.id);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const discount = parseInt(form.discount_percent, 10);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      alert('Discount must be between 0 and 100.');
      return;
    }

    setSaving(true);

    const payload = {
      code: form.code.trim().toUpperCase(),
      description: form.description.trim() || null,
      discount_percent: discount,
      active: form.active,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };

    if (editingId) {
      const { error } = await supabase
        .from('promotions')
        .update(payload)
        .eq('id', editingId);
      if (error) {
        alert('Error updating promotion: ' + error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from('promotions').insert(payload);
      if (error) {
        alert('Error creating promotion: ' + error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setModalOpen(false);
    fetchPromotions();
  };

  const toggleActive = async (promo: Promotion) => {
    await supabase.from('promotions').update({ active: !promo.active }).eq('id', promo.id);
    fetchPromotions();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('promotions').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchPromotions();
  };

  const isExpired = (expiresAt: string | null): boolean => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus size={18} />
          Add Promotion
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3 text-right">Discount</th>
                <th className="px-5 py-3 text-center">Active</th>
                <th className="px-5 py-3">Starts</th>
                <th className="px-5 py-3">Expires</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    No promotions yet.
                  </td>
                </tr>
              ) : (
                promotions.map((promo, idx) => (
                  <tr
                    key={promo.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      idx % 2 === 1 ? 'bg-gray-50/50' : ''
                    }`}
                  >
                    <td className="px-5 py-3">
                      <span className="inline-block bg-gray-100 text-gray-900 font-mono font-semibold text-xs px-2.5 py-1 rounded">
                        {promo.code}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-600 max-w-xs truncate">
                      {promo.description || '--'}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-pink-500">
                      {promo.discount_percent}%
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleActive(promo)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${
                          promo.active ? 'bg-pink-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                            promo.active ? 'left-5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {promo.starts_at
                        ? new Date(promo.starts_at).toLocaleDateString()
                        : '--'}
                    </td>
                    <td className="px-5 py-3">
                      {promo.expires_at ? (
                        <span
                          className={
                            isExpired(promo.expires_at)
                              ? 'text-red-500'
                              : 'text-gray-500'
                          }
                        >
                          {new Date(promo.expires_at).toLocaleDateString()}
                          {isExpired(promo.expires_at) && (
                            <span className="ml-1 text-xs">(expired)</span>
                          )}
                        </span>
                      ) : (
                        '--'
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(promo)}
                          className="p-1.5 text-gray-400 hover:text-pink-500 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        {deleteConfirm === promo.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(promo.id)}
                              className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(null)}
                              className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(promo.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Promotion' : 'New Promotion'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code *
                </label>
                <input
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. SUMMER25"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percent * (0-100)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  max="100"
                  value={form.discount_percent}
                  onChange={(e) =>
                    setForm({ ...form, discount_percent: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Starts At
                  </label>
                  <input
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expires At
                  </label>
                  <input
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                />
                Active
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50 rounded-lg transition-colors"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
