import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, Search, SlidersHorizontal, Download, Filter, Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DocumentTable from '@/components/dashboard/DocumentTable';
import DocumentUpload from '@/components/upload/DocumentUpload';
import { Document } from '@/components/dashboard/DocumentTable';

export default function Documents() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterProject, setFilterProject] = useState('all');

  // Fetch documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ['/api/documents'],
    enabled: false, // Temporarily disabled until API is ready
  });

  // Sample data for demonstration
  const sampleDocuments: Document[] = [
    {
      id: 1,
      name: 'Laporan Progres Bulanan',
      project: 'Pembangunan Apartemen Grand Residence',
      date: '24 Jun 2023',
      type: 'PDF',
      size: '3.4 MB',
      uploadedBy: 'Admin Sistem'
    },
    {
      id: 2,
      name: 'Anggaran Q2 2023',
      project: 'Jembatan Suramadu Extension',
      date: '20 Jun 2023',
      type: 'XLS',
      size: '1.2 MB',
      uploadedBy: 'Admin Sistem'
    },
    {
      id: 3,
      name: 'Kontrak Vendor Material',
      project: 'Bandung Tech Park',
      date: '18 Jun 2023',
      type: 'DOC',
      size: '2.8 MB',
      uploadedBy: 'Admin Sistem'
    },
    {
      id: 4,
      name: 'Foto Dokumentasi Site',
      project: 'Pembangunan Apartemen Grand Residence',
      date: '15 Jun 2023',
      type: 'JPG',
      size: '5.7 MB',
      uploadedBy: 'Admin Sistem'
    },
    {
      id: 5,
      name: 'Rencana Anggaran Biaya',
      project: 'Bandung Tech Park',
      date: '12 Jun 2023',
      type: 'XLS',
      size: '2.3 MB',
      uploadedBy: 'Admin Sistem'
    },
    {
      id: 6,
      name: 'Jadwal Konstruksi',
      project: 'Jembatan Suramadu Extension',
      date: '10 Jun 2023',
      type: 'PDF',
      size: '1.8 MB',
      uploadedBy: 'Admin Sistem'
    },
    {
      id: 7,
      name: 'Spesifikasi Teknis',
      project: 'Pembangunan Apartemen Grand Residence',
      date: '05 Jun 2023',
      type: 'DOC',
      size: '4.2 MB',
      uploadedBy: 'Admin Sistem'
    },
    {
      id: 8,
      name: 'Persetujuan Desain',
      project: 'Bandung Tech Park',
      date: '01 Jun 2023',
      type: 'PDF',
      size: '3.1 MB',
      uploadedBy: 'Admin Sistem'
    }
  ];

  // Filter documents based on search query and filters
  const filteredDocuments = sampleDocuments.filter(doc => {
    // Search filter
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.project.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = filterType === 'all' || doc.type === filterType;
    
    // Project filter
    const matchesProject = filterProject === 'all' || doc.project === filterProject;
    
    return matchesSearch && matchesType && matchesProject;
  });

  // Get unique projects for filter dropdown
  const uniqueProjects = Array.from(new Set(sampleDocuments.map(doc => doc.project)));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-richblack">Dokumen</h1>
        <p className="mt-1 text-sm text-gray-600">Kelola semua dokumen proyek konstruksi</p>
      </div>

      {/* Filters and actions */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Cari dokumen..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="flex items-center"
              onClick={() => document.getElementById('exportButton')?.click()}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              className="bg-gold hover:bg-gold-dark text-white"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Unggah Dokumen
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">Filter:</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <div className="w-full">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tipe Dokumen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="DOC">DOC</SelectItem>
                  <SelectItem value="XLS">XLS</SelectItem>
                  <SelectItem value="JPG">JPG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full">
              <Select value={filterProject} onValueChange={setFilterProject}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Proyek" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Proyek</SelectItem>
                  {uniqueProjects.map((project, index) => (
                    <SelectItem key={index} value={project}>{project}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Document list */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-heading font-semibold text-richblack mb-6">Daftar Dokumen</h2>
          
          {filteredDocuments.length > 0 ? (
            <DocumentTable documents={filteredDocuments} />
          ) : (
            <div className="text-center py-10">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada dokumen</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tidak ada dokumen yang sesuai dengan filter atau pencarian Anda.
              </p>
              <div className="mt-6">
                <Button
                  className="bg-gold hover:bg-gold-dark text-white"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Unggah Dokumen
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload document modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="max-w-xl w-full">
            <DocumentUpload />
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsUploadModalOpen(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
