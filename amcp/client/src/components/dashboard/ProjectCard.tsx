import { Card } from '@/components/ui/card';

export interface ProjectCardProps {
  id: number;
  name: string;
  location: string;
  image: string;
  status: 'active' | 'pending' | 'completed';
  updatedAt: string;
  onClick?: () => void;
}

export default function ProjectCard({
  name,
  location,
  image,
  status,
  updatedAt,
  onClick
}: ProjectCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  const statusLabels = {
    active: 'Aktif',
    pending: 'Pending',
    completed: 'Selesai'
  };

  return (
    <Card className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="flex justify-between items-start">
        <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden shadow-sm">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">{name}</h3>
          <p className="text-sm text-gray-600 mt-1">{location}</p>
          <div className="mt-2 flex items-center">
            <div className={`text-xs px-2.5 py-0.5 rounded-full ${statusColors[status]}`}>
              {statusLabels[status]}
            </div>
            <p className="text-xs text-gray-500 ml-2">Diperbarui: {updatedAt}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
