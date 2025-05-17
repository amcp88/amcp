import { useQuery } from '@tanstack/react-query';
import { File, Building2, Calendar, Clipboard } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ProjectCard from '@/components/dashboard/ProjectCard';
import DocumentTable from '@/components/dashboard/DocumentTable';
import DocumentUpload from '@/components/upload/DocumentUpload';
import { Document } from '@/components/dashboard/DocumentTable';
import { ProjectCardProps } from '@/components/dashboard/ProjectCard';

export default function Dashboard() {
  // Fetch stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/stats'],
    enabled: false, // Temporarily disabled until API is ready
  });

  // Fetch recent projects
  const { data: recentProjects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['/api/projects/recent'],
    enabled: false, // Temporarily disabled until API is ready
  });

  // Fetch recent documents
  const { data: recentDocuments, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['/api/documents/recent'],
    enabled: false, // Temporarily disabled until API is ready
  });

  // Sample data for demonstration
  const sampleStats = {
    totalDocuments: 248,
    activeProjects: 12,
    documentsThisMonth: 36,
    storage: '4.2 GB'
  };

  const sampleProjects: ProjectCardProps[] = [
    {
      id: 1,
      name: 'Pembangunan Apartemen Grand Residence',
      location: 'Jakarta Selatan',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
      status: 'active',
      updatedAt: '2 jam lalu'
    },
    {
      id: 2,
      name: 'Jembatan Suramadu Extension',
      location: 'Surabaya',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200',
      status: 'active',
      updatedAt: '1 hari lalu'
    },
    {
      id: 3,
      name: 'Bandung Tech Park',
      location: 'Bandung',
      image: 'https://pixabay.com/get/gad66bd55e9659dd65a8b1eb3e69a78ebc0224f003914a1332944abe9190d36a077372b4b7ba7817be77e4c87a8b6d59d6b975c4c54a89f29d9caec96f677e919_1280.jpg',
      status: 'pending',
      updatedAt: '3 hari lalu'
    }
  ];

  const sampleDocuments: Document[] = [
    {
      id: 1,
      name: 'Laporan Progres Bulanan',
      project: 'Pembangunan Apartemen Grand Residence',
      date: '24 Jun 2023',
      type: 'PDF'
    },
    {
      id: 2,
      name: 'Anggaran Q2 2023',
      project: 'Jembatan Suramadu Extension',
      date: '20 Jun 2023',
      type: 'XLS'
    },
    {
      id: 3,
      name: 'Kontrak Vendor Material',
      project: 'Bandung Tech Park',
      date: '18 Jun 2023',
      type: 'DOC'
    },
    {
      id: 4,
      name: 'Foto Dokumentasi Site',
      project: 'Pembangunan Apartemen Grand Residence',
      date: '15 Jun 2023',
      type: 'JPG'
    }
  ];

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Selamat datang di Sistem Manajemen Dokumen Konstruksi</p>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Dokumen" 
          value={sampleStats.totalDocuments} 
          icon={<File className="h-6 w-6 text-white" />}
          linkHref="/documents"
        />
        <StatCard 
          title="Proyek Aktif" 
          value={sampleStats.activeProjects} 
          icon={<Building2 className="h-6 w-6 text-white" />}
          linkHref="/projects"
        />
        <StatCard 
          title="Dokumen Bulan Ini" 
          value={sampleStats.documentsThisMonth} 
          icon={<Calendar className="h-6 w-6 text-white" />}
          linkHref="/documents"
        />
        <StatCard 
          title="Penyimpanan" 
          value={sampleStats.storage} 
          icon={<Clipboard className="h-6 w-6 text-white" />}
          linkText="Kelola"
          linkHref="/settings"
        />
      </div>

      {/* Document Upload Section */}
      <div className="mb-8">
        <DocumentUpload />
      </div>

      {/* Recent Projects and Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-gray-900">Proyek Terbaru</h2>
              <a href="/projects" className="text-sm font-medium text-gold hover:text-gold-dark">
                Lihat semua
              </a>
            </div>

            {/* Project list */}
            <div className="space-y-4">
              {sampleProjects.map(project => (
                <ProjectCard 
                  key={project.id}
                  {...project}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold text-gray-900">Dokumen Terbaru</h2>
              <a href="/documents" className="text-sm font-medium text-gold hover:text-gold-dark">
                Lihat semua
              </a>
            </div>

            {/* Document table */}
            <DocumentTable documents={sampleDocuments} />
          </div>
        </div>
      </div>
    </div>
  );
}
