import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRequestStore } from '@/store/requestStore';

type ViewMode = 'table' | 'kanban';
type FilterStatus = 'all' | 'pending' | 'validated' | 'assigned' | 'in-progress' | 'review' | 'approved' | 'scheduled' | 'published' | 'rejected';
type FilterPriority = 'all' | 'low' | 'medium' | 'high' | 'urgent';

export default function RequestList() {
  const { requests, loading, error, pagination, fetchRequests } = useRequestStore();
  
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [filterContentType, setFilterContentType] = useState('all');
  
  useEffect(() => {
    loadRequests();
  }, [filterStatus, filterPriority, filterContentType, pagination.page]);
  
  const loadRequests = () => {
    const filters: any = {};
    if (filterStatus !== 'all') filters.status = filterStatus;
    if (filterPriority !== 'all') filters.priority = filterPriority;
    if (filterContentType !== 'all') filters.contentType = filterContentType;
    if (searchQuery) filters.search = searchQuery;
    
    fetchRequests(pagination.page, 12, filters);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRequests();
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'validated': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-indigo-100 text-indigo-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-teal-100 text-teal-800';
      case 'published': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Menunggu',
      validated: 'Tervalidasi',
      assigned: 'Ditugaskan',
      'in-progress': 'Dikerjakan',
      review: 'Review',
      approved: 'Disetujui',
      scheduled: 'Terjadwal',
      published: 'Dipublikasi',
      rejected: 'Ditolak'
    };
    return labels[status] || status;
  };
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const isDeadlineSoon = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 3 && days >= 0;
  };
  
  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };
  
  const kanbanColumns = [
    { key: 'pending', label: 'Menunggu' },
    { key: 'validated', label: 'Tervalidasi' },
    { key: 'assigned', label: 'Ditugaskan' },
    { key: 'in-progress', label: 'Dikerjakan' },
    { key: 'review', label: 'Review' },
    { key: 'approved', label: 'Disetujui' },
    { key: 'scheduled', label: 'Terjadwal' },
    { key: 'published', label: 'Dipublikasi' }
  ];
  
  const getRequestsByStatus = (status: string) => {
    return requests.filter(req => req.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Request Konten</h1>
              <p className="text-sm text-gray-500 mt-1">
                Kelola permintaan konten dari anggota GMNI Depok
              </p>
            </div>
            <Link
              to="/requests/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              + Buat Request Baru
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters & Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan judul, deskripsi, atau nomor tiket..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Cari
              </button>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="validated">Tervalidasi</option>
                <option value="assigned">Ditugaskan</option>
                <option value="in-progress">Dikerjakan</option>
                <option value="review">Review</option>
                <option value="approved">Disetujui</option>
                <option value="scheduled">Terjadwal</option>
                <option value="published">Dipublikasi</option>
                <option value="rejected">Ditolak</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as FilterPriority)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Semua Prioritas</option>
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
                <option value="urgent">Urgent</option>
              </select>

              <select
                value={filterContentType}
                onChange={(e) => setFilterContentType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Semua Tipe</option>
                <option value="Poster">Poster</option>
                <option value="Flyer">Flyer</option>
                <option value="Feed Instagram">Feed Instagram</option>
                <option value="Story Instagram">Story Instagram</option>
                <option value="Video">Video</option>
                <option value="Carousel">Carousel</option>
                <option value="Infografis">Infografis</option>
                <option value="Twibbon">Twibbon</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`flex-1 px-4 py-2 rounded-lg transition ${
                    viewMode === 'table'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📋 Table
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('kanban')}
                  className={`flex-1 px-4 py-2 rounded-lg transition ${
                    viewMode === 'kanban'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📊 Kanban
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-gray-500 mt-2">Memuat data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Table View */}
        {!loading && !error && viewMode === 'table' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiket / Judul
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipe Konten
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prioritas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requester
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Tidak ada request ditemukan
                      </td>
                    </tr>
                  ) : (
                    requests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <Link to={`/requests/${request._id}`} className="block">
                            <div className="text-sm font-medium text-primary-600 hover:text-primary-700">
                              {request.ticketId}
                            </div>
                            <div className="text-sm text-gray-900 mt-1">{request.title}</div>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{request.contentType}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {getStatusLabel(request.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                            {request.priority.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(request.deadline)}
                            {isOverdue(request.deadline) && (
                              <span className="ml-2 text-red-600 text-xs">⚠️ Terlambat</span>
                            )}
                            {isDeadlineSoon(request.deadline) && !isOverdue(request.deadline) && (
                              <span className="ml-2 text-orange-600 text-xs">⏰ Segera</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {typeof request.requestedBy === 'object' ? request.requestedBy.fullName : 'N/A'}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Halaman {pagination.page} dari {pagination.totalPages} ({pagination.total} total)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => useRequestStore.getState().setPage(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => useRequestStore.getState().setPage(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Kanban View */}
        {!loading && !error && viewMode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {kanbanColumns.map((column) => {
              const columnRequests = getRequestsByStatus(column.key);
              return (
                <div key={column.key} className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center justify-between">
                    {column.label}
                    <span className="bg-gray-300 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                      {columnRequests.length}
                    </span>
                  </h3>
                  <div className="space-y-3">
                    {columnRequests.map((request) => (
                      <Link
                        key={request._id}
                        to={`/requests/${request._id}`}
                        className="block bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition border border-gray-200"
                      >
                        <div className="text-xs text-primary-600 font-medium mb-1">
                          {request.ticketId}
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                          {request.title}
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600">{request.contentType}</span>
                          <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          📅 {formatDate(request.deadline)}
                          {isOverdue(request.deadline) && <span className="text-red-600">⚠️</span>}
                          {isDeadlineSoon(request.deadline) && !isOverdue(request.deadline) && (
                            <span className="text-orange-600">⏰</span>
                          )}
                        </div>
                      </Link>
                    ))}
                    {columnRequests.length === 0 && (
                      <div className="text-center py-6 text-gray-400 text-sm">
                        Tidak ada request
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
