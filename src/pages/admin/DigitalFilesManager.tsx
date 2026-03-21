import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
  FolderOpen,
  Upload,
  FileText,
  File,
  Trash2,
  Pencil,
  Plus,
  Search,
  X,
  Loader2,
  Download,
  Link,
} from 'lucide-react';

const SUPABASE_URL = 'https://jxqpafclueeolpxgxmye.supabase.co';
const BUCKET = 'digital-products';

interface DigitalProduct {
  id: string;
  product_id: string | null;
  name: string;
  description: string | null;
  file_url: string;
  file_type: string;
  file_size: number;
  download_count: number;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
}

interface UploadForm {
  name: string;
  description: string;
  product_id: string;
}

interface EditForm {
  name: string;
  description: string;
  product_id: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

function getFileIcon(fileType: string) {
  const ext = fileType.toLowerCase();
  const iconClass = 'shrink-0';

  if (['pdf'].includes(ext))
    return <FileText size={20} className={`${iconClass} text-red-500`} />;
  if (['doc', 'docx'].includes(ext))
    return <FileText size={20} className={`${iconClass} text-blue-500`} />;
  if (['xls', 'xlsx', 'csv'].includes(ext))
    return <FileText size={20} className={`${iconClass} text-green-500`} />;
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext))
    return <FolderOpen size={20} className={`${iconClass} text-yellow-500`} />;
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext))
    return <File size={20} className={`${iconClass} text-purple-500`} />;
  if (['mp4', 'mov', 'avi', 'mkv'].includes(ext))
    return <File size={20} className={`${iconClass} text-pink-500`} />;
  if (['mp3', 'wav', 'ogg', 'flac'].includes(ext))
    return <File size={20} className={`${iconClass} text-indigo-500`} />;

  return <File size={20} className={`${iconClass} text-gray-400`} />;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DigitalFilesManager() {
  const [files, setFiles] = useState<DigitalProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Upload modal
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const [uploadForm, setUploadForm] = useState<UploadForm>({ name: '', description: '', product_id: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ name: '', description: '', product_id: '' });
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Data fetching
  // -----------------------------------------------------------------------

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('digital_products')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setFiles(data ?? []);
    setLoading(false);
  }, []);

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('id, name').order('name');
    if (data) setProducts(data);
  }, []);

  useEffect(() => {
    fetchFiles();
    fetchProducts();
  }, [fetchFiles, fetchProducts]);

  // -----------------------------------------------------------------------
  // Upload
  // -----------------------------------------------------------------------

  const openUpload = () => {
    setSelectedFile(null);
    setUploadForm({ name: '', description: '', product_id: '' });
    setUploadProgress(0);
    setUploadOpen(true);
  };

  const handleFilePick = (file: globalThis.File | null) => {
    if (!file) return;
    setSelectedFile(file);
    if (!uploadForm.name) {
      setUploadForm((f) => ({ ...f, name: file.name.replace(/\.[^.]+$/, '') }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFilePick(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const ext = getExtension(selectedFile.name);
      const path = `files/${Date.now()}-${selectedFile.name}`;

      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, selectedFile);

      clearInterval(progressInterval);

      if (uploadError) {
        alert('Upload failed: ' + uploadError.message);
        setUploading(false);
        return;
      }

      setUploadProgress(95);

      const fileUrl = `${SUPABASE_URL}/storage/v1/object/authenticated/${BUCKET}/${path}`;

      const { error: insertError } = await supabase.from('digital_products').insert({
        name: uploadForm.name.trim() || selectedFile.name,
        description: uploadForm.description.trim() || null,
        product_id: uploadForm.product_id || null,
        file_url: fileUrl,
        file_type: ext,
        file_size: selectedFile.size,
        download_count: 0,
      });

      if (insertError) {
        alert('Error saving file record: ' + insertError.message);
        setUploading(false);
        return;
      }

      setUploadProgress(100);
      setUploading(false);
      setUploadOpen(false);
      fetchFiles();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      alert('Upload error: ' + message);
      setUploading(false);
    }
  };

  // -----------------------------------------------------------------------
  // Edit
  // -----------------------------------------------------------------------

  const openEdit = (file: DigitalProduct) => {
    setEditForm({
      name: file.name,
      description: file.description ?? '',
      product_id: file.product_id ?? '',
    });
    setEditingId(file.id);
    setEditOpen(true);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);

    const { error } = await supabase
      .from('digital_products')
      .update({
        name: editForm.name.trim(),
        description: editForm.description.trim() || null,
        product_id: editForm.product_id || null,
      })
      .eq('id', editingId);

    if (error) {
      alert('Error updating: ' + error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setEditOpen(false);
    fetchFiles();
  };

  // -----------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------

  const handleDelete = async (file: DigitalProduct) => {
    // Extract storage path from URL
    const prefix = `${SUPABASE_URL}/storage/v1/object/authenticated/${BUCKET}/`;
    const storagePath = file.file_url.startsWith(prefix)
      ? file.file_url.slice(prefix.length)
      : null;

    if (storagePath) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
    }

    await supabase.from('digital_products').delete().eq('id', file.id);
    setDeleteConfirm(null);
    fetchFiles();
  };

  // -----------------------------------------------------------------------
  // Derived data
  // -----------------------------------------------------------------------

  const filtered = files.filter(
    (f) =>
      !search || f.name.toLowerCase().includes(search.toLowerCase())
  );

  const productMap = new Map(products.map((p) => [p.id, p.name]));

  const totalFiles = files.length;
  const totalDownloads = files.reduce((sum, f) => sum + f.download_count, 0);
  const totalStorage = files.reduce((sum, f) => sum + f.file_size, 0);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

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
        <h1 className="text-2xl font-bold text-gray-900">Digital Files</h1>
        <button
          type="button"
          onClick={openUpload}
          className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus size={18} />
          Upload File
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
            <FolderOpen size={20} className="text-pink-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Files</p>
            <p className="text-xl font-bold text-gray-900">{totalFiles}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
            <Download size={20} className="text-pink-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Downloads</p>
            <p className="text-xl font-bold text-gray-900">{totalDownloads.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
            <Upload size={20} className="text-pink-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Total Storage</p>
            <p className="text-xl font-bold text-gray-900">{formatFileSize(totalStorage)}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search files by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Linked Product</th>
                <th className="px-5 py-3 text-center">Type</th>
                <th className="px-5 py-3 text-right">Size</th>
                <th className="px-5 py-3 text-center">Downloads</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-500">
                    No files found.
                  </td>
                </tr>
              ) : (
                filtered.map((file, idx) => (
                  <tr
                    key={file.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      idx % 2 === 1 ? 'bg-gray-50/50' : ''
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.file_type)}
                        <span className="font-medium text-gray-900 truncate max-w-[200px]">
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 truncate max-w-[180px]">
                      {file.description || <span className="text-gray-300">--</span>}
                    </td>
                    <td className="px-5 py-3">
                      {file.product_id ? (
                        <span className="inline-flex items-center gap-1 text-pink-600 text-xs font-medium">
                          <Link size={12} />
                          {productMap.get(file.product_id) ?? 'Unknown'}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">None</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 uppercase">
                        {file.file_type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-600">
                      {formatFileSize(file.file_size)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-gray-600">
                        <Download size={14} className="text-gray-400" />
                        {file.download_count.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(file.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(file)}
                          className="p-1.5 text-gray-400 hover:text-pink-500 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        {deleteConfirm === file.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(file)}
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
                            onClick={() => setDeleteConfirm(file.id)}
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

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upload File</h2>
              <button
                type="button"
                onClick={() => setUploadOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {/* Drag & Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-pink-500 bg-pink-50'
                    : selectedFile
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)}
                />
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    {getFileIcon(getExtension(selectedFile.name))}
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-xs text-red-500 hover:text-red-600 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={32} className="text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Drag & drop a file here, or <span className="text-pink-500 font-medium">browse</span>
                    </p>
                    <p className="text-xs text-gray-400">Any file type supported</p>
                  </div>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="Auto-filled from filename"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              {/* Link to Product */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link to Product (optional)
                </label>
                <select
                  value={uploadForm.product_id}
                  onChange={(e) => setUploadForm({ ...uploadForm, product_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">None</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Progress Bar */}
              {uploading && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-50 rounded-lg transition-colors"
                >
                  {uploading && <Loader2 size={16} className="animate-spin" />}
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Edit File</h2>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link to Product (optional)
                </label>
                <select
                  value={editForm.product_id}
                  onChange={(e) => setEditForm({ ...editForm, product_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">None</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
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
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
