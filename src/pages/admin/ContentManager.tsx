import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
  Globe,
  Check,
  AlertCircle,
} from 'lucide-react';

interface SiteContent {
  id: string;
  section_key: string;
  section_label: string;
  content: Record<string, unknown>;
  updated_at: string;
}

// Maps section_key -> field definitions for rendering the correct input type
const FIELD_META: Record<string, Record<string, 'text' | 'textarea' | 'color' | 'boolean' | 'image'>> = {
  hero: {
    title: 'text',
    subtitle: 'text',
    cta_text: 'text',
    background_image: 'image',
  },
  about: {
    title: 'text',
    description: 'textarea',
    image: 'image',
  },
  footer: {
    company_name: 'text',
    email: 'text',
    phone: 'text',
    address: 'text',
    social_facebook: 'text',
    social_instagram: 'text',
    social_linkedin: 'text',
    social_twitter: 'text',
  },
  announcement: {
    enabled: 'boolean',
    text: 'text',
    link: 'text',
    bg_color: 'color',
  },
};

function prettyLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

let toastId = 0;

export default function ContentManager() {
  const [sections, setSections] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section_key');

    if (error) {
      addToast('error', 'Failed to load content sections.');
    } else if (data) {
      setSections(data as SiteContent[]);
      const d: Record<string, Record<string, unknown>> = {};
      for (const s of data as SiteContent[]) {
        d[s.section_key] = { ...s.content };
      }
      setDrafts(d);
    }
    setLoading(false);
  }, [addToast]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateDraft = (sectionKey: string, fieldKey: string, value: unknown) => {
    setDrafts((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldKey]: value,
      },
    }));
  };

  const handleSave = async (section: SiteContent) => {
    setSaving((prev) => ({ ...prev, [section.section_key]: true }));

    const { error } = await supabase
      .from('site_content')
      .update({
        content: drafts[section.section_key],
        updated_at: new Date().toISOString(),
      })
      .eq('id', section.id);

    if (error) {
      addToast('error', `Error saving ${section.section_label}.`);
    } else {
      addToast('success', `${section.section_label} saved!`);
      await fetchSections();
    }

    setSaving((prev) => ({ ...prev, [section.section_key]: false }));
  };

  const renderField = (sectionKey: string, fieldKey: string, fieldType: string) => {
    const value = drafts[sectionKey]?.[fieldKey];

    if (fieldType === 'boolean') {
      const checked = Boolean(value);
      return (
        <div key={fieldKey} className="flex items-center justify-between py-3">
          <label className="text-sm font-medium text-gray-700">{prettyLabel(fieldKey)}</label>
          <button
            type="button"
            onClick={() => updateDraft(sectionKey, fieldKey, !checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              checked ? 'bg-pink-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                checked ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      );
    }

    if (fieldType === 'color') {
      return (
        <div key={fieldKey} className="space-y-1 py-3">
          <label className="block text-sm font-medium text-gray-700">{prettyLabel(fieldKey)}</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={typeof value === 'string' ? value : '#000000'}
              onChange={(e) => updateDraft(sectionKey, fieldKey, e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-gray-200 p-1"
            />
            <input
              type="text"
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => updateDraft(sectionKey, fieldKey, e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              placeholder="#000000"
            />
          </div>
        </div>
      );
    }

    if (fieldType === 'textarea') {
      return (
        <div key={fieldKey} className="space-y-1 py-3">
          <label className="block text-sm font-medium text-gray-700">{prettyLabel(fieldKey)}</label>
          <textarea
            value={typeof value === 'string' ? value : ''}
            onChange={(e) => updateDraft(sectionKey, fieldKey, e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            placeholder={prettyLabel(fieldKey)}
          />
        </div>
      );
    }

    if (fieldType === 'image') {
      const url = typeof value === 'string' ? value : '';
      return (
        <div key={fieldKey} className="space-y-1 py-3">
          <label className="block text-sm font-medium text-gray-700">{prettyLabel(fieldKey)}</label>
          <input
            type="text"
            value={url}
            onChange={(e) => updateDraft(sectionKey, fieldKey, e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            placeholder="https://example.com/image.jpg"
          />
          {url && (
            <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
              <img
                src={url}
                alt={prettyLabel(fieldKey)}
                className="h-32 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      );
    }

    // Default: text input
    return (
      <div key={fieldKey} className="space-y-1 py-3">
        <label className="block text-sm font-medium text-gray-700">{prettyLabel(fieldKey)}</label>
        <input
          type="text"
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => updateDraft(sectionKey, fieldKey, e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          placeholder={prettyLabel(fieldKey)}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Globe className="h-8 w-8 text-pink-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
          <p className="text-sm text-gray-500">Edit your website sections and content</p>
        </div>
      </div>

      {/* Section Cards */}
      {sections.map((section) => {
        const isExpanded = expanded[section.section_key] ?? false;
        const isSaving = saving[section.section_key] ?? false;
        const meta = FIELD_META[section.section_key];
        const fields = meta
          ? Object.entries(meta)
          : Object.keys(section.content).map((k) => [k, 'text'] as const);

        return (
          <div
            key={section.id}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            {/* Card Header */}
            <button
              type="button"
              onClick={() => toggleExpand(section.section_key)}
              className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{section.section_label}</h2>
                <p className="text-xs text-gray-400">
                  Last updated: {formatDate(section.updated_at)}
                </p>
              </div>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t border-gray-200 px-6 pb-6">
                <div className="divide-y divide-gray-100">
                  {fields.map(([fieldKey, fieldType]) =>
                    renderField(section.section_key, fieldKey as string, fieldType as string)
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSave(section)}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-60"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {sections.length === 0 && !loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-500">No content sections found.</p>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all animate-fade-in ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
