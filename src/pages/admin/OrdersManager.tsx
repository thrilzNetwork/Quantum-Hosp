import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  status: OrderStatus;
  total: number;
  created_at: string;
}

const statuses: OrderStatus[] = ['pending', 'processing', 'completed', 'cancelled'];

const statusColor: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setOrders(data ?? []);
    setLoading(false);
  };

  const toggleExpand = async (orderId: string) => {
    if (expandedId === orderId) {
      setExpandedId(null);
      setOrderItems([]);
      return;
    }

    setExpandedId(orderId);
    setLoadingItems(true);
    const { data } = await supabase
      .from('order_items')
      .select('id, product_name, quantity, unit_price')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true });
    setOrderItems(data ?? []);
    setLoadingItems(false);
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);
    if (error) {
      alert('Error updating status: ' + error.message);
      return;
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const filtered = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as OrderStatus | '')}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-5 py-3 w-10" />
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order, idx) => (
                  <>
                    <tr
                      key={order.id}
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                        idx % 2 === 1 ? 'bg-gray-50/50' : ''
                      }`}
                      onClick={() => toggleExpand(order.id)}
                    >
                      <td className="px-5 py-3 text-gray-400">
                        {expandedId === order.id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {order.customer_name}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{order.customer_email}</td>
                      <td className="px-5 py-3">
                        <select
                          value={order.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value as OrderStatus)
                          }
                          className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                            statusColor[order.status]
                          }`}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-gray-900">
                        ${Number(order.total).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>

                    {/* Expanded order items */}
                    {expandedId === order.id && (
                      <tr key={`${order.id}-items`}>
                        <td colSpan={6} className="px-5 py-0 bg-gray-50">
                          <div className="py-4 pl-10">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              Order Items
                            </h4>
                            {loadingItems ? (
                              <div className="py-3 flex items-center gap-2 text-gray-400 text-sm">
                                <Loader2 size={14} className="animate-spin" /> Loading...
                              </div>
                            ) : orderItems.length === 0 ? (
                              <p className="text-sm text-gray-500 py-2">No items.</p>
                            ) : (
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="text-left text-gray-500 text-xs uppercase">
                                    <th className="pr-4 py-1">Product</th>
                                    <th className="pr-4 py-1 text-right">Qty</th>
                                    <th className="pr-4 py-1 text-right">Unit Price</th>
                                    <th className="py-1 text-right">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {orderItems.map((item) => (
                                    <tr key={item.id}>
                                      <td className="pr-4 py-2 text-gray-900">
                                        {item.product_name}
                                      </td>
                                      <td className="pr-4 py-2 text-right text-gray-600">
                                        {item.quantity}
                                      </td>
                                      <td className="pr-4 py-2 text-right text-gray-600">
                                        ${Number(item.unit_price).toFixed(2)}
                                      </td>
                                      <td className="py-2 text-right font-medium text-gray-900">
                                        ${(item.quantity * Number(item.unit_price)).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
