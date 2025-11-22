import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRequestStore } from '@/store/requestStore';
import toast from 'react-hot-toast';

export default function RequestForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const { currentRequest, loading, createRequest, updateRequest, fetchRequest } = useRequestStore();
  
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'Feed Instagram',
    deadline: '',
    purpose: '',
    description: '',
    keyPoints: [''],
    targetAudience: '',
    publishPlatform: [] as string[],
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    references: ''
  });
  
  useEffect(() => {
    if (isEditMode && id) {
      fetchRequest(id);
    }
  }, [id, isEditMode]);
  
  useEffect(() => {
    if (isEditMode && currentRequest) {
      setFormData({
        title: currentRequest.title,
        contentType: currentRequest.contentType,
        deadline: new Date(currentRequest.deadline).toISOString().split('T')[0],
        purpose: currentRequest.purpose,
        description: currentRequest.description,
        keyPoints: currentRequest.keyPoints.length > 0 ? currentRequest.keyPoints : [''],
        targetAudience: currentRequest.targetAudience,
        publishPlatform: currentRequest.publishPlatform,
        priority: currentRequest.priority,
        references: currentRequest.references || ''
      });
    }
  }, [currentRequest, isEditMode]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleKeyPointChange = (index: number, value: string) => {
    const newKeyPoints = [...formData.keyPoints];
    newKeyPoints[index] = value;
    setFormData(prev => ({ ...prev, keyPoints: newKeyPoints }));
  };
  
  const addKeyPoint = () => {
    setFormData(prev => ({ ...prev, keyPoints: [...prev.keyPoints, ''] }));
  };
  
  const removeKeyPoint = (index: number) => {
    if (formData.keyPoints.length > 1) {
      const newKeyPoints = formData.keyPoints.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, keyPoints: newKeyPoints }));
    }
  };
  
  const handlePlatformChange = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      publishPlatform: prev.publishPlatform.includes(platform)
        ? prev.publishPlatform.filter(p => p !== platform)
        : [...prev.publishPlatform, platform]
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Judul request harus diisi');
      return;
    }
    if (!formData.deadline) {
      toast.error('Deadline harus diisi');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Deskripsi harus diisi');
      return;
    }
    if (formData.publishPlatform.length === 0) {
      toast.error('Pilih minimal 1 platform publikasi');
      return;
    }
    
    const cleanedKeyPoints = formData.keyPoints.filter(point => point.trim() !== '');
    if (cleanedKeyPoints.length === 0) {
      toast.error('Minimal harus ada 1 poin penting');
      return;
    }
    
    const requestData = {
      ...formData,
      keyPoints: cleanedKeyPoints
    };
    
    try {
      if (isEditMode && id) {
        await updateRequest(id, requestData);
        toast.success('Request berhasil diperbarui');
      } else {
        await createRequest(requestData);
        toast.success('Request berhasil dibuat');
      }
      navigate('/requests');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan request');
    }
  };
  
  const contentTypes = [
    'Feed Instagram',
    'Story Instagram',
    'Carousel',
    'Poster',
    'Flyer',
    'Video',
    'Infografis',
    'Twibbon'
  ];
  
  const platforms = [
    'Instagram',
    'Facebook',
    'Twitter',
    'TikTok',
    'YouTube',
    'WhatsApp',
    'Website'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/requests')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            ← Kembali ke Daftar Request
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Request Konten' : 'Buat Request Konten Baru'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Isi form dengan lengkap untuk memudahkan tim KKI dalam proses produksi
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Request <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Contoh: Poster Kegiatan Pelatihan Kepemimpinan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Content Type & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Konten <span className="text-red-500">*</span>
              </label>
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                {contentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioritas <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority }))}
                  className={`px-4 py-2 rounded-lg border-2 transition ${
                    formData.priority === priority
                      ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {priority === 'low' && '🟢 Rendah'}
                  {priority === 'medium' && '🟡 Sedang'}
                  {priority === 'high' && '🟠 Tinggi'}
                  {priority === 'urgent' && '🔴 Urgent'}
                </button>
              ))}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tujuan Konten <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Contoh: Promosi kegiatan, Edukasi anggota, Kampanye isu"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Detail <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Jelaskan secara detail tentang konten yang diminta, konteks kegiatan, pesan yang ingin disampaikan, dll."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Key Points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poin-Poin Penting <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Informasi utama yang harus ada dalam konten (tanggal, lokasi, narasumber, dll)
            </p>
            <div className="space-y-2">
              {formData.keyPoints.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleKeyPointChange(index, e.target.value)}
                    placeholder={`Poin ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {formData.keyPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeKeyPoint(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addKeyPoint}
              className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              + Tambah Poin
            </button>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audiens <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              placeholder="Contoh: Anggota GMNI, Mahasiswa Umum, Alumni, Masyarakat Umum"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          {/* Publish Platform */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Publikasi <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">Pilih platform tempat konten akan dipublikasikan</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handlePlatformChange(platform)}
                  className={`px-4 py-2 rounded-lg border-2 transition text-sm ${
                    formData.publishPlatform.includes(platform)
                      ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* References */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referensi (Opsional)
            </label>
            <textarea
              name="references"
              value={formData.references}
              onChange={handleChange}
              rows={3}
              placeholder="Link, contoh desain, atau referensi lain yang dapat membantu tim KKI"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/requests')}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Buat Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
