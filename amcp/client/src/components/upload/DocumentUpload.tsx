import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function DocumentUpload() {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    // Check file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File terlalu besar",
        description: "Ukuran file maksimal adalah 20MB",
        variant: "destructive"
      });
      return;
    }

    // Check file types
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Format file tidak didukung",
        description: "Format yang didukung: PDF, DOC, XLS, JPG",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Send the file to the server
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Reset the selected file
      setSelectedFile(null);
      
      // Show success toast
      toast({
        title: "Upload berhasil",
        description: "Dokumen telah berhasil diunggah",
        variant: "default"
      });

      // Invalidate queries to refresh document lists
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload gagal",
        description: "Terjadi kesalahan saat mengunggah dokumen",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
      <CardContent className="p-6">
        <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">Unggah Dokumen</h2>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragging ? 'border-gold bg-gold/5' : 'border-gray-300 hover:border-gold'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <div className="mx-auto h-12 w-12 text-gold bg-gold/10 rounded-full flex items-center justify-center">
                <Cloud className="h-6 w-6" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-gray-500 text-xs">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button 
                variant="default" 
                className="bg-gold hover:bg-gold-dark text-white"
                disabled={uploading}
                onClick={(e) => {
                  e.stopPropagation();
                  uploadFile();
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Unggah File
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              <Cloud className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Klik untuk memilih file atau tarik dan lepas file di sini
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Mendukung file PDF, DOC, XLS, JPG hingga 20MB
              </p>
              <Button className="mt-4 bg-gold hover:bg-gold-dark text-white">
                Pilih File
              </Button>
            </>
          )}
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg"
            onChange={handleFileChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
