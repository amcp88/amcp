import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { ProjectCardProps } from '@/components/dashboard/ProjectCard';

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch projects
  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
    enabled: false, // Temporarily disabled until API is ready
  });

  // Sample data for demonstration
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
    },
    {
      id: 4,
      name: 'Renovasi Stadion Utama',
      location: 'Jakarta',
      image: 'https://pixabay.com/get/ga30828ab9c2be1e8d90e0a6a6a66095eea2f1eb0fe6c5d74a40c0bc14f7fa01f3adcc95731dbe08b5c9a3bc2e77dcc47_1280.jpg',
      status: 'active',
      updatedAt: '1 minggu lalu'
    },
    {
      id: 5,
      name: 'Tol Cisumdawu',
      location: 'Bandung',
      image: 'https://pixabay.com/get/g3cc7bd3a05d8da2d94bc15baec23d36b40cc1e85fd26877a452ad0b8fc93ba0c3b6f1ef2a79f1bd13ed9e22e47e5de6f_1280.jpg',
      status: 'completed',
      updatedAt: '2 minggu lalu'
    },
    {
      id: 6,
      name: 'Kawasan Industri Batang',
      location: 'Jawa Tengah',
      image: 'https://pixabay.com/get/g9c63c1d58d73c0cf76d06d0f3bfb1ee8c2e94b5a54a31cad1fc8d3ac8ff5a32f7c4a8fa1a8a5e71d5c7c4cd15a0a96cd_1280.jpg',
      status: 'pending',
      updatedAt: '3 minggu lalu'
    }
  ];

  // Filter projects based on search query
  const filteredProjects = sampleProjects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-richblack">Proyek</h1>
        <p className="mt-1 text-sm text-gray-600">Kelola semua proyek konstruksi</p>
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
              placeholder="Cari proyek..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            className="bg-gold hover:bg-gold-dark text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Proyek
          </Button>
        </div>
      </div>

      {/* Projects grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <Card key={project.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.name} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-richblack leading-tight">{project.name}</h3>
                    <p className="text-sm text-gray-600">{project.location}</p>
                  </div>
                  <div className={`text-xs px-2.5 py-0.5 rounded-full ${
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status === 'active' ? 'Aktif' : 
                     project.status === 'pending' ? 'Pending' : 'Selesai'}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">Diperbarui: {project.updatedAt}</p>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow border border-gray-200">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada proyek</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tidak ada proyek yang sesuai dengan pencarian Anda.
          </p>
          <div className="mt-6">
            <Button 
              className="bg-gold hover:bg-gold-dark text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Proyek
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
