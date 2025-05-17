import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, FileDown, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Reports() {
  const [reportType, setReportType] = useState('document');
  const [timeRange, setTimeRange] = useState('month');
  const [exportFormat, setExportFormat] = useState('pdf');

  // Fetch report data
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['/api/reports', reportType, timeRange],
    enabled: false, // Temporarily disabled until API is ready
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-richblack">Laporan</h1>
        <p className="mt-1 text-sm text-gray-600">Buat dan unduh laporan proyek konstruksi</p>
      </div>

      {/* Report configuration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Konfigurasi Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Laporan
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis laporan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Laporan Dokumen</SelectItem>
                  <SelectItem value="project">Laporan Proyek</SelectItem>
                  <SelectItem value="storage">Laporan Penyimpanan</SelectItem>
                  <SelectItem value="activity">Laporan Aktivitas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rentang Waktu
              </label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih rentang waktu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Minggu Ini</SelectItem>
                  <SelectItem value="month">Bulan Ini</SelectItem>
                  <SelectItem value="quarter">Kuartal Ini</SelectItem>
                  <SelectItem value="year">Tahun Ini</SelectItem>
                  <SelectItem value="custom">Kustom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format Ekspor
              </label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih format ekspor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="xls">Excel</SelectItem>
                  <SelectItem value="doc">Word</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button className="bg-gold hover:bg-gold-dark text-white">
              <FileDown className="mr-2 h-4 w-4" />
              Buat Laporan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report preview */}
      <Card>
        <CardHeader>
          <CardTitle>Pratinjau Laporan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-8 min-h-96 flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <BarChart3 className="h-16 w-16 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-richblack">
                {reportType === 'document' ? 'Laporan Dokumen' :
                 reportType === 'project' ? 'Laporan Proyek' :
                 reportType === 'storage' ? 'Laporan Penyimpanan' : 'Laporan Aktivitas'}
              </h3>
              <p className="text-sm text-gray-500">
                {timeRange === 'week' ? 'Minggu Ini' :
                 timeRange === 'month' ? 'Bulan Ini' :
                 timeRange === 'quarter' ? 'Kuartal Ini' :
                 timeRange === 'year' ? 'Tahun Ini' : 'Rentang Kustom'}
              </p>
            </div>

            <div className="w-full max-w-lg flex flex-col space-y-4">
              <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">Total Dokumen</span>
                </div>
                <span className="font-semibold">248</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">Dokumen Baru</span>
                </div>
                <span className="font-semibold">36</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium">Proyek Aktif</span>
                </div>
                <span className="font-semibold">12</span>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button className="bg-gold hover:bg-gold-dark text-white">
                <FileDown className="mr-2 h-4 w-4" />
                Unduh Laporan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
