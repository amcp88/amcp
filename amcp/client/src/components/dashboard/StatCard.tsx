import { ReactNode } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  linkText?: string;
  linkHref?: string;
  className?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  linkText = "Lihat semua", 
  linkHref = "#",
  className 
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden shadow border border-gray-200", className)}>
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-gold p-3 rounded-md">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-xl font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <a href={linkHref} className="font-medium text-gold hover:text-gold-dark">
            {linkText}
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}
