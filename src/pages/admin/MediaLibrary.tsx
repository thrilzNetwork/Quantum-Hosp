import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Upload,
  FileText,
  File,
  Trash2,
  Copy,
  Check,
  Grid,
  List,
  Search,
  X,
  Loader2,
  FolderOpen,
} from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  folder: string;
  alt_text: string;
  created_at: string;
}

type FolderFilter = 'all' | 'images' | 'documents' | 'other';
type ViewMode = 'grid' | 'list';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'xlsx'];

function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

function getFileFolder(fileName: string): string {
  const ext = getFileExtension(fileName);
  if (IMAGE_EXTENSIONS.includes(ext)) return 'images';
  if (DOCUMENT_EXTENSIONS.includes(ext)) return 'documents';
  return 'other';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [folderFilter, setFolderFilter] = useState<FolderFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [editAltText, setEditAltText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMedia(data as MediaItem[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true);
    const fileArray = Array.from(files);
    const progress: Record<string, number> = {};
    fileArray.forEach((f) => (progress[f.name] = 0));
    setUploadProgress({ ...progress });

    for (const file of fileArray) {
      try {
        const uniqueName = `${Date.now()}-${file.name}`;
        const folder = getFileFolder(file.name);
        const path = `${folder}/${uniqueName}`;

        progress[file.name] = 30;
        setUploadProgress({ ...progress });

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(path, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          progress[file.name] = -1;
          setUploadProgress({ ...progress });
          continue;
        }

        progress[file.name] = 70;
        setUploadProgress({ ...progress });

        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(path);

        const publicUrl = urlData.publicUrl;

        const { error: insertError } = await supabase.from('media').insert({
          name: file.name.replace(/\.[^/.]+$/, ''),
          file_name: uniqueName,
          file_url: publicUrl,
          file_type: getFileExtension(file.name),
          file_size: file.size,
          folder,
          alt_text: '',
        });

        if (insertError) {
          console.error('Insert error:', insertError);
          progress[file.name] = -1;
        } else {
          progress[file.name] = 100;
        }
        setUploadProgress({ ...progress });
      } catch (err) {
        console.error('Error uploading file:', err);
        progress[file.name] = -1;
        setUploadProgress({ ...progress });
      }
    }

    await fetchMedia();
    setUploading(false);
    setTimeout(() => setUploadProgress({}), 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDelete = async (item: MediaItem) => {
    const path = `${item.folder}/${item.file_name}`;
    await supabase.storage.from('media').remove([path]);
    await supabase.from('media').delete().eq('id', item.id);
    setSelectedItem(null);
    setDeleteConfirm(null);
    fetchMedia();
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleUpdateAltText = async () => {
    if (!selectedItem) return;
    await supabase
      .from('media')
      .update({ alt_text: editAltText })
      .eq('id', selectedItem.id);
    setSelectedItem({ ...selectedItem, alt_text: editAltText });
    fetchMedia();
  };

  const filteredMedia = media.filter((item) => {
    const matchesFolder =
      folderFilter === 'all' || item.folder === folderFilter;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const isImage = (fileType: string) => IMAGE_EXTENSIONS.includes(fileType);

  const renderFileIcon = (item: MediaItem) => {
    if (isImage(item.file_type)) {
      return (
        <img
          src={item.file_url}
          alt={item.alt_text || item.name}
          className="w-full h-full object-cover"
        />
      );
    }
    if (DOCUMENT_EXTENSIONS.includes(item.file_type)) {
      return <FileText className="w-10 h-10 text-pink-400" />;
    }
    return <File className="w-10 h-10 text-gray-400" />;
  };

  const folderTabs: { key: FolderFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'images', label: 'Images' },
    { key: 'documents', label: 'Documents' },
    { key: 'other', label: 'Other' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-6 ${
          dragOver
            ? 'border-pink-500 bg-pink-50'
            : 'border-gray-300 bg-white hover:border-pink-400 hover:bg-pink-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <Upload
          className={`w-10 h-10 mx-auto mb-3 ${
            dragOver ? 'text-pink-500' : 'text-gray-400'
          }`}
        />
        <p className="text-gray-600 font-medium">
          {dragOver
            ? 'Drop files here'
            : 'Drag & drop files here, or click to browse'}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Supports images, documents, and other file types
        </p>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 space-y-3">
          {Object.entries(uploadProgress).map(([name, pct]) => (
            <div key={name} className="flex items-center gap-3">
              {pct >= 0 && pct < 100 && (
                <Loader2 className="w-4 h-4 text-pink-500 animate-spin shrink-0" />
              )}
              {pct === 100 && (
                <Check className="w-4 h-4 text-green-500 shrink-0" />
              )}
              {pct === -1 && <X className="w-4 h-4 text-red-500 shrink-0" />}
              <span className="text-sm text-gray-700 truncate flex-1">
                {name}
              </span>
              {pct >= 0 && pct < 100 && (
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
              {pct === 100 && (
                <span className="text-xs text-green-600">Uploaded</span>
              )}
              {pct === -1 && (
                <span className="text-xs text-red-600">Failed</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm border">
          {folderTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFolderFilter(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                folderFilter === tab.key
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMedia.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No media files found
          </h3>
          <p className="text-gray-400 mb-4">
            {searchQuery
              ? 'Try a different search term'
              : 'Upload your first file to get started'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Files
            </button>
          )}
        </div>
      )}

      {/* Grid View */}
      {!loading && filteredMedia.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedItem(item);
                setEditAltText(item.alt_text || '');
              }}
              className="bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
            >
              <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                {renderFileIcon(item)}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {item.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">
                    {formatFileSize(item.file_size)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(item.created_at)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl(item.file_url, item.id);
                  }}
                  className="mt-2 w-full flex items-center justify-center gap-1 text-xs py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy URL
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && filteredMedia.length > 0 && viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">
                  File
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden sm:table-cell">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden md:table-cell">
                  Size
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3 hidden md:table-cell">
                  Date
                </th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMedia.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setEditAltText(item.alt_text || '');
                  }}
                  className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        {isImage(item.file_type) ? (
                          <img
                            src={item.file_url}
                            alt={item.alt_text || item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : DOCUMENT_EXTENSIONS.includes(item.file_type) ? (
                          <FileText className="w-5 h-5 text-pink-400" />
                        ) : (
                          <File className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs uppercase bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {item.file_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    {formatFileSize(item.file_size)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(item.file_url, item.id);
                      }}
                      className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy URL
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setSelectedItem(null);
            setDeleteConfirm(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Preview */}
            {isImage(selectedItem.file_type) && (
              <div className="bg-gray-100 rounded-t-2xl p-4 flex items-center justify-center">
                <img
                  src={selectedItem.file_url}
                  alt={selectedItem.alt_text || selectedItem.name}
                  className="max-h-64 object-contain rounded"
                />
              </div>
            )}

            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedItem.name}
                  </h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {selectedItem.file_name}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setDeleteConfirm(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">File Size</span>
                  <p className="text-gray-800 font-medium">
                    {formatFileSize(selectedItem.file_size)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Upload Date</span>
                  <p className="text-gray-800 font-medium">
                    {formatDate(selectedItem.created_at)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Type</span>
                  <p className="text-gray-800 font-medium uppercase">
                    {selectedItem.file_type}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Folder</span>
                  <p className="text-gray-800 font-medium capitalize">
                    {selectedItem.folder}
                  </p>
                </div>
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Alt Text
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editAltText}
                    onChange={(e) => setEditAltText(e.target.value)}
                    placeholder="Describe this file..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleUpdateAltText}
                    className="px-3 py-2 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* File URL */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  File URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedItem.file_url}
                    className="flex-1 border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 truncate"
                  />
                  <button
                    onClick={() =>
                      handleCopyUrl(selectedItem.file_url, selectedItem.id)
                    }
                    className="px-3 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center gap-1"
                  >
                    {copiedId === selectedItem.id ? (
                      <>
                        <Check className="w-4 h-4" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Delete */}
              <div className="pt-2 border-t">
                {deleteConfirm === selectedItem.id ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-red-600">
                      Are you sure? This cannot be undone.
                    </span>
                    <button
                      onClick={() => handleDelete(selectedItem)}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(selectedItem.id)}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete File
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
