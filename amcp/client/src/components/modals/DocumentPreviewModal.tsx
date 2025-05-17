import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Edit, X, AlertCircle, Loader2, Maximize2, FileText, Printer } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/components/dashboard/DocumentTable";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
}

interface DocumentAnalysis {
  summary: string;
  keywords: string[];
  category?: string;
  categories?: string[];
  dates?: string[];
  values?: string[];
  entities?: string[];
  analyzedAt?: string;
}

export default function DocumentPreviewModal({ 
  isOpen, 
  onClose, 
  document 
}: DocumentPreviewModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  
  // Function to get the icon based on document type
  const getDocumentIcon = () => {
    const iconClassName = "h-5 w-5 text-white";
    
    switch (document.type) {
      case 'PDF':
        return <div className="flex-shrink-0 h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">PDF</div>;
      case 'DOC':
        return <div className="flex-shrink-0 h-8 w-8 bg-red-600 rounded-md flex items-center justify-center">DOC</div>;
      case 'XLS':
        return <div className="flex-shrink-0 h-8 w-8 bg-green-600 rounded-md flex items-center justify-center">XLS</div>;
      case 'JPG':
        return <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-md flex items-center justify-center">JPG</div>;
      default:
        return <div className="flex-shrink-0 h-8 w-8 bg-gray-600 rounded-md flex items-center justify-center">?</div>;
    }
  };
  
  // Load document analysis when modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchDocumentAnalysis();
    }
  }, [isOpen, document.id]);
  
  // Mock function to fetch document analysis - would be replaced with an actual API call
  const fetchDocumentAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This would be the actual API call in production
      // const response = await fetch(`/api/documents/${document.id}/analysis`);
      // if (!response.ok) throw new Error('Gagal memuat analisis dokumen');
      // const data = await response.json();
      
      // Mock analysis data for demonstration
      const mockAnalysis: DocumentAnalysis = {
        summary: "Dokumen ini berisi spesifikasi teknis untuk proyek konstruksi gedung kantor. Mencakup detail material, standar kualitas, dan prosedur instalasi.",
        keywords: ["spesifikasi teknis", "material konstruksi", "standar kualitas", "prosedur instalasi"],
        category: "Spesifikasi Teknis",
        dates: ["2025-03-15", "2025-06-30"],
        values: ["450 m²", "Rp 4.500.000.000", "12 bulan"],
        entities: ["PT Asmin Marga Chayi Prabhu", "Departemen Pekerjaan Umum", "Ir. Suryadi Wibowo"],
        analyzedAt: new Date().toISOString()
      };
      
      setAnalysis(mockAnalysis);
    } catch (err) {
      console.error("Error fetching document analysis:", err);
      setError("Gagal memuat analisis dokumen. Silakan coba lagi nanti.");
      toast({
        title: "Error",
        description: "Gagal memuat analisis dokumen",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Render document content based on type
  const renderDocumentPreview = () => {
    // Display loading state
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg">
          <Loader2 className="h-8 w-8 text-gold animate-spin mb-2" />
          <p className="text-gray-500">Memuat dokumen...</p>
        </div>
      );
    }
    
    // Display error state
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-gray-700 font-medium">Terjadi Kesalahan</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <Button 
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={fetchDocumentAnalysis}
          >
            Coba Lagi
          </Button>
        </div>
      );
    }
    
    // Render different preview based on document type
    switch (document.type) {
      case 'PDF':
        return (
          <object
            data={`/uploads/${document.id}.pdf`}
            type="application/pdf"
            width="100%"
            height="500px"
            className="border rounded-lg"
          >
            <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg">
              <FileText className="h-8 w-8 text-blue-500 mb-2" />
              <p className="text-gray-700">Dokumen PDF tidak dapat ditampilkan</p>
              <Button 
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => window.open(`/uploads/${document.id}.pdf`, '_blank')}
              >
                <Download className="h-4 w-4 mr-1" />
                Unduh PDF
              </Button>
            </div>
          </object>
        );
        
      case 'JPG':
        return (
          <div className="flex flex-col items-center bg-gray-50 rounded-lg p-4">
            <div className="relative">
              <img 
                src={`/uploads/${document.id}.jpg`} 
                alt={document.name}
                className="max-w-full rounded border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Available';
                }} 
              />
              <Button 
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2 opacity-80 hover:opacity-100"
                onClick={() => setFullscreen(!fullscreen)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-lg">
            <FileText className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">Pratinjau tidak tersedia untuk tipe dokumen ini</p>
            <p className="text-sm text-gray-400 mt-1">Silakan unduh untuk melihat isi dokumen</p>
          </div>
        );
    }
  };
  
  // Render AI analysis tab content
  const renderAnalysisTab = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 text-gold animate-spin mb-2" />
          <p className="text-gray-500">Menganalisis dokumen...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-gray-700 font-medium">Analisis Gagal</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <Button 
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={fetchDocumentAnalysis}
          >
            Coba Lagi
          </Button>
        </div>
      );
    }
    
    if (!analysis) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <p className="text-gray-500">Tidak ada hasil analisis</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-5 py-2">
        {/* Summary */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Ringkasan</h4>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{analysis.summary}</p>
        </div>
        
        {/* Keywords */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Kata Kunci</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword, idx) => (
              <Badge key={idx} variant="outline" className="text-gray-700 bg-gray-50">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Category */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Kategori</h4>
          <Badge className="text-white bg-gold font-medium">{analysis.category}</Badge>
        </div>
        
        {/* Dates */}
        {analysis.dates && analysis.dates.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Tanggal Penting</h4>
            <ul className="list-disc pl-5 text-gray-700">
              {analysis.dates.map((date, idx) => (
                <li key={idx}>{date}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Values */}
        {analysis.values && analysis.values.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Nilai Penting</h4>
            <ul className="list-disc pl-5 text-gray-700">
              {analysis.values.map((value, idx) => (
                <li key={idx}>{value}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Entities */}
        {analysis.entities && analysis.entities.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Entitas yang Disebutkan</h4>
            <ul className="list-disc pl-5 text-gray-700">
              {analysis.entities.map((entity, idx) => (
                <li key={idx}>{entity}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Analysis timestamp */}
        {analysis.analyzedAt && (
          <div className="text-xs text-gray-400 text-right">
            Dianalisis pada: {new Date(analysis.analyzedAt).toLocaleString('id-ID')}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${fullscreen ? 'w-screen h-screen max-w-none rounded-none' : 'sm:max-w-4xl max-h-[90vh]'} flex flex-col`}>
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-heading font-semibold text-gray-900">
              {document.name}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({document.type})
              </span>
            </DialogTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setFullscreen(!fullscreen)}
                title={fullscreen ? "Keluar dari Layar Penuh" : "Layar Penuh"}
              >
                <Maximize2 className="h-4 w-4 text-gray-500" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={onClose}
                title="Tutup"
              >
                <X className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 pt-4 border-b">
            <TabsList>
              <TabsTrigger value="preview">Pratinjau</TabsTrigger>
              <TabsTrigger value="analysis">Analisis AI</TabsTrigger>
              <TabsTrigger value="details">Detail</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6 overflow-auto flex-1">
            <TabsContent value="preview" className="mt-0 h-full">
              {renderDocumentPreview()}
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-0">
              {renderAnalysisTab()}
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Detail Dokumen</h4>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <dt className="text-gray-500 text-sm">Nama Dokumen</dt>
                    <dd className="text-gray-900 font-medium">{document.name}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-sm">Proyek</dt>
                    <dd className="text-gray-900 font-medium">{document.project}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-sm">Ukuran File</dt>
                    <dd className="text-gray-900 font-medium">{document.size || '3.4 MB'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-sm">Format</dt>
                    <dd className="text-gray-900 font-medium flex items-center">
                      {getDocumentIcon()}
                      <span className="ml-2">{document.type}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-sm">Tanggal Unggah</dt>
                    <dd className="text-gray-900 font-medium">{document.date}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500 text-sm">Diunggah Oleh</dt>
                    <dd className="text-gray-900 font-medium">{document.uploadedBy || 'Admin Sistem'}</dd>
                  </div>
                </dl>
                
                <div className="mt-6 flex flex-wrap gap-2">
                  <Button 
                    variant="default" 
                    className="inline-flex items-center"
                  >
                    <Download className="h-4 w-4 mr-1.5" />
                    Unduh
                  </Button>
                  <Button 
                    variant="outline" 
                    className="inline-flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1.5" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="inline-flex items-center"
                  >
                    <Printer className="h-4 w-4 mr-1.5" />
                    Cetak
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
