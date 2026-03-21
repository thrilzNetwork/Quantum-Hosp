import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';

interface DailyStat {
  date: string;
  orders: number;
  revenue: number;
}

interface TopProduct {
  product_name: string;
  total_qty: number;
  total_revenue: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, number>>({});
  const [revenueByMonth, setRevenueByMonth] = useState<{ month: string; revenue: number }[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);

    const now = new Date();
    let since: string | null = null;
    if (timeRange === '7d') since = new Date(now.getTime() - 7 * 86400000).toISOString();
    else if (timeRange === '30d') since = new Date(now.getTime() - 30 * 86400000).toISOString();
    else if (timeRange === '90d') since = new Date(now.getTime() - 90 * 86400000).toISOString();

    try {
      // Fetch all orders
      let ordersQuery = supabase.from('orders').select('*');
      if (since) ordersQuery = ordersQuery.gte('created_at', since);
      const { data: orders } = await ordersQuery;

      // Fetch all order items
      const { data: items } = await supabase.from('order_items').select('*');

      // Fetch product count
      const { count: prodCount } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true });

      // Fetch customer count
      const { count: custCount } = await supabase
        .from('customers')
        .select('id', { count: 'exact', head: true });

      const orderList = orders ?? [];
      const itemList = items ?? [];

      // Total stats
      const rev = orderList.reduce((s, o) => s + Number(o.total || 0), 0);
      setTotalRevenue(rev);
      setTotalOrders(orderList.length);
      setTotalCustomers(custCount ?? 0);
      setTotalProducts(prodCount ?? 0);
      setAvgOrderValue(orderList.length > 0 ? rev / orderList.length : 0);

      // Orders by status
      const byStatus: Record<string, number> = {};
      orderList.forEach((o) => {
        byStatus[o.status] = (byStatus[o.status] || 0) + 1;
      });
      setOrdersByStatus(byStatus);

      // Daily stats (last N days)
      const dailyMap: Record<string, { orders: number; revenue: number }> = {};
      orderList.forEach((o) => {
        const d = new Date(o.created_at).toISOString().slice(0, 10);
        if (!dailyMap[d]) dailyMap[d] = { orders: 0, revenue: 0 };
        dailyMap[d].orders++;
        dailyMap[d].revenue += Number(o.total || 0);
      });
      const daily = Object.entries(dailyMap)
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => a.date.localeCompare(b.date));
      setDailyStats(daily);

      // Revenue by month
      const monthMap: Record<string, number> = {};
      orderList.forEach((o) => {
        const m = new Date(o.created_at).toISOString().slice(0, 7);
        monthMap[m] = (monthMap[m] || 0) + Number(o.total || 0);
      });
      const months = Object.entries(monthMap)
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => a.month.localeCompare(b.month));
      setRevenueByMonth(months);

      // Top products by quantity sold
      const productMap: Record<string, { qty: number; rev: number }> = {};
      itemList.forEach((i) => {
        const name = i.product_name;
        if (!productMap[name]) productMap[name] = { qty: 0, rev: 0 };
        productMap[name].qty += i.quantity;
        productMap[name].rev += i.quantity * Number(i.unit_price);
      });
      const top = Object.entries(productMap)
        .map(([product_name, s]) => ({
          product_name,
          total_qty: s.qty,
          total_revenue: s.rev,
        }))
        .sort((a, b) => b.total_qty - a.total_qty)
        .slice(0, 10);
      setTopProducts(top);
    } catch (err) {
      console.error('Analytics error:', err);
    }

    setLoading(false);
  };

  const maxRevenue = Math.max(...dailyStats.map((d) => d.revenue), 1);

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">Track your business performance</p>
        </div>
        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range === 'all' ? 'All Time' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-green-500 bg-green-50', trend: '+12%', up: true },
          { label: 'Orders', value: totalOrders, icon: ShoppingCart, color: 'text-blue-500 bg-blue-50', trend: '+8%', up: true },
          { label: 'Customers', value: totalCustomers, icon: Users, color: 'text-purple-500 bg-purple-50', trend: '+5%', up: true },
          { label: 'Avg Order', value: `$${avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: 'text-orange-500 bg-orange-50', trend: '+3%', up: true },
          { label: 'Products', value: totalProducts, icon: Package, color: 'text-pink-500 bg-pink-50', trend: '', up: true },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <Icon size={18} />
                </div>
                {card.trend && (
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${card.up ? 'text-green-500' : 'text-red-500'}`}>
                    {card.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {card.trend}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart (bar) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 size={18} className="text-gray-400" />
            Daily Revenue
          </h3>
        </div>
        {dailyStats.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No order data available for this period</p>
        ) : (
          <div className="flex items-end gap-1 h-48 overflow-x-auto pb-2">
            {dailyStats.map((day) => (
              <div key={day.date} className="flex flex-col items-center flex-shrink-0" style={{ minWidth: '32px' }}>
                <div className="relative w-6 group">
                  <div
                    className="w-full bg-gradient-to-t from-pink-500 to-pink-400 rounded-t transition-all hover:from-pink-600 hover:to-pink-500"
                    style={{ height: `${Math.max((day.revenue / maxRevenue) * 160, 4)}px` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                    ${day.revenue.toFixed(0)} &middot; {day.orders} orders
                  </div>
                </div>
                <span className="text-[9px] text-gray-400 mt-1 rotate-45 origin-left">
                  {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Orders by Status</h3>
          {Object.keys(ordersByStatus).length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(ordersByStatus).map(([status, count]) => {
                const colors: Record<string, string> = {
                  pending: 'bg-yellow-400',
                  processing: 'bg-blue-400',
                  completed: 'bg-green-400',
                  cancelled: 'bg-red-400',
                };
                const pct = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="capitalize text-gray-700">{status}</span>
                      <span className="text-gray-500">{count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[status] ?? 'bg-gray-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.product_name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-5 text-right">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.product_name}</p>
                    <p className="text-xs text-gray-500">{p.total_qty} sold</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ${p.total_revenue.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Monthly Revenue */}
      {revenueByMonth.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" />
            Monthly Revenue
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase border-b border-gray-100">
                  <th className="pb-2">Month</th>
                  <th className="pb-2 text-right">Revenue</th>
                  <th className="pb-2 w-1/2"></th>
                </tr>
              </thead>
              <tbody>
                {revenueByMonth.map((m) => {
                  const maxMonth = Math.max(...revenueByMonth.map((r) => r.revenue), 1);
                  const pct = (m.revenue / maxMonth) * 100;
                  return (
                    <tr key={m.month} className="border-b border-gray-50">
                      <td className="py-2 text-gray-700 font-medium">
                        {new Date(m.month + '-01').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </td>
                      <td className="py-2 text-right font-semibold text-gray-900">
                        ${m.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 pl-4">
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
