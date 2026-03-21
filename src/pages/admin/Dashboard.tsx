import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Tag,
  Users,
  FileText,
  Image,
  Loader2,
  ArrowRight,
  TrendingUp,
  Clock,
  Rocket,
} from 'lucide-react';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  activePromotions: number;
  totalCustomers: number;
  totalBlogPosts: number;
  totalMedia: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total: number;
  created_at: string;
}

interface RecentPost {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  draft: 'bg-gray-100 text-gray-800',
  published: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-500',
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    activePromotions: 0,
    totalCustomers: 0,
    totalBlogPosts: 0,
    totalMedia: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        productsRes,
        ordersRes,
        promotionsRes,
        recentOrdersRes,
        customersRes,
        blogRes,
        mediaRes,
        pendingRes,
        recentPostsRes,
      ] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id, total', { count: 'exact' }),
        supabase.from('promotions').select('id', { count: 'exact', head: true }).eq('active', true),
        supabase.from('orders').select('id, customer_name, customer_email, status, total, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('customers').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('media').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('blog_posts').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      const revenue = ordersRes.data
        ?.filter((o: { total: number }) => o.total != null)
        .reduce((sum: number, o: { total: number }) => sum + Number(o.total), 0) ?? 0;

      setStats({
        totalProducts: productsRes.count ?? 0,
        totalOrders: ordersRes.count ?? 0,
        revenue,
        activePromotions: promotionsRes.count ?? 0,
        totalCustomers: customersRes.count ?? 0,
        totalBlogPosts: blogRes.count ?? 0,
        totalMedia: mediaRes.count ?? 0,
        pendingOrders: pendingRes.count ?? 0,
      });
      setRecentOrders(recentOrdersRes.data ?? []);
      setRecentPosts(recentPostsRes.data ?? []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-pink-500" />
      </div>
    );
  }

  const statCards = [
    { label: 'Revenue', value: `$${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-green-500 bg-green-50', link: '/admin/analytics' },
    { label: 'Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-500 bg-blue-50', link: '/admin/orders' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'text-pink-500 bg-pink-50', link: '/admin/products' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'text-purple-500 bg-purple-50', link: '/admin/customers' },
    { label: 'Blog Posts', value: stats.totalBlogPosts, icon: FileText, color: 'text-orange-500 bg-orange-50', link: '/admin/blog' },
    { label: 'Media Files', value: stats.totalMedia, icon: Image, color: 'text-teal-500 bg-teal-50', link: '/admin/media' },
    { label: 'Promotions', value: stats.activePromotions, icon: Tag, color: 'text-yellow-500 bg-yellow-50', link: '/admin/promotions' },
    { label: 'Pending', value: stats.pendingOrders, icon: Clock, color: 'text-red-500 bg-red-50', link: '/admin/orders' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold mb-1">Welcome back!</h1>
          <p className="text-sm text-gray-300">Here's what's happening with your store today.</p>
        </div>
        <Link
          to="/admin/settings"
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-pink-500/25"
        >
          <Rocket size={16} />
          Publish
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:border-pink-300 hover:shadow-sm transition-all group"
            >
              <div className={`p-2.5 rounded-lg ${card.color}`}>
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 truncate">{card.label}</p>
                <p className="text-lg font-bold text-gray-900">{card.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Add Product', path: '/admin/products', icon: Package, color: 'bg-pink-500' },
          { label: 'Write Blog', path: '/admin/blog', icon: FileText, color: 'bg-blue-500' },
          { label: 'Upload Media', path: '/admin/media', icon: Image, color: 'bg-purple-500' },
          { label: 'View Analytics', path: '/admin/analytics', icon: TrendingUp, color: 'bg-green-500' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              to={action.path}
              className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-colors text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center text-white`}>
                <Icon size={16} />
              </div>
              {action.label}
              <ArrowRight size={14} className="ml-auto text-gray-400" />
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No orders yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{order.customer_name}</p>
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                    <span className="text-sm font-bold text-gray-900">${Number(order.total).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Blog Posts</h3>
            <Link to="/admin/blog" className="text-xs text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No blog posts yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentPosts.map((post) => (
                <div key={post.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                    <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColor[post.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
