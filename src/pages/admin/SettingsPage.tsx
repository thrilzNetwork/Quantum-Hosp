import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Settings,
  Rocket,
  Loader2,
  Check,
  AlertCircle,
  Globe,
  Key,
  Shield,
  RefreshCw,
} from 'lucide-react';

interface SiteSettings {
  deploy_hook_url: string;
  site_name: string;
  site_description: string;
  maintenance_mode: boolean;
  admin_email: string;
}

const defaultSettings: SiteSettings = {
  deploy_hook_url: '',
  site_name: 'Quantum Hospitality',
  site_description: 'Transform Your Guest Experience',
  maintenance_mode: false,
  admin_email: '',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deployMessage, setDeployMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    loadSettings();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? '');
    });
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('site_content')
      .select('*')
      .eq('section_key', 'settings')
      .single();

    if (data) {
      setSettings({ ...defaultSettings, ...(data.content as object) });
    } else {
      // Create settings row if it doesn't exist
      await supabase.from('site_content').insert({
        section_key: 'settings',
        section_label: 'Site Settings',
        content: defaultSettings,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('site_content')
      .update({ content: settings })
      .eq('section_key', 'settings');

    if (error) {
      alert('Error saving: ' + error.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    if (!settings.deploy_hook_url) {
      setDeployStatus('error');
      setDeployMessage('No deploy hook URL configured. Add your Vercel Deploy Hook URL above.');
      setTimeout(() => setDeployStatus('idle'), 4000);
      return;
    }

    setDeploying(true);
    setDeployStatus('idle');

    try {
      const res = await fetch(settings.deploy_hook_url, { method: 'POST' });
      if (res.ok) {
        setDeployStatus('success');
        setDeployMessage('Deployment triggered! Your site will be live in ~60 seconds.');
      } else {
        setDeployStatus('error');
        setDeployMessage(`Deploy failed: ${res.status} ${res.statusText}`);
      }
    } catch {
      setDeployStatus('error');
      setDeployMessage('Failed to trigger deployment. Check your deploy hook URL.');
    }

    setDeploying(false);
    setTimeout(() => setDeployStatus('idle'), 5000);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    setPasswordError('');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSaved(true);
      setNewPassword('');
      setTimeout(() => setPasswordSaved(false), 3000);
    }
    setChangingPassword(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your site and deployment settings</p>
      </div>

      {/* Publish to Live */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Rocket size={20} className="text-pink-400" />
              <h2 className="text-lg font-bold">Publish to Live</h2>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Push all your changes live. This triggers a new Vercel deployment.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePublish}
            disabled={deploying}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40"
          >
            {deploying ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Rocket size={18} />
            )}
            {deploying ? 'Deploying...' : 'Publish Now'}
          </button>
        </div>
        {deployStatus === 'success' && (
          <div className="mt-3 flex items-center gap-2 text-green-400 text-sm bg-green-500/10 rounded-lg px-3 py-2">
            <Check size={16} />
            {deployMessage}
          </div>
        )}
        {deployStatus === 'error' && (
          <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
            <AlertCircle size={16} />
            {deployMessage}
          </div>
        )}
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Globe size={18} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900">General</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
            <textarea
              rows={2}
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input
              type="email"
              value={settings.admin_email}
              onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
              placeholder="notifications@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="flex items-center justify-between bg-yellow-50 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-xs text-gray-500">Show a maintenance page to visitors</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
              className={`w-11 h-6 rounded-full relative transition-colors ${
                settings.maintenance_mode ? 'bg-yellow-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings.maintenance_mode ? 'left-5.5 translate-x-0' : 'left-0.5'
                }`}
                style={{ left: settings.maintenance_mode ? '22px' : '2px' }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Deployment Config */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <RefreshCw size={18} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900">Deployment</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vercel Deploy Hook URL
            </label>
            <input
              value={settings.deploy_hook_url}
              onChange={(e) => setSettings({ ...settings, deploy_hook_url: e.target.value })}
              placeholder="https://api.vercel.com/v1/integrations/deploy/..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Get this from Vercel &rarr; Project Settings &rarr; Git &rarr; Deploy Hooks
            </p>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <Shield size={18} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900">Account Security</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
              <Key size={14} />
              {userEmail}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 6 characters)"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={changingPassword || !newPassword}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded-lg transition-colors"
              >
                {changingPassword ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  'Update'
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            )}
            {passwordSaved && (
              <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                <Check size={12} /> Password updated successfully
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Settings size={16} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <Check size={16} /> Settings saved!
          </span>
        )}
      </div>
    </div>
  );
}
