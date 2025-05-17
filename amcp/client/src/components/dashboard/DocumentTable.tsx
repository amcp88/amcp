import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useState } from "react";
import DocumentPreviewModal from "../modals/DocumentPreviewModal";
import { FileText, BarChart, FileSpreadsheet, FileImage } from "lucide-react";

export interface Document {
  id: number;
  name: string;
  project: string;
  date: string;
  type: 'PDF' | 'DOC' | 'XLS' | 'JPG';
  size?: string;
  uploadedBy?: string;
}

interface DocumentTableProps {
  documents: Document[];
}

export default function DocumentTable({ documents }: DocumentTableProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'DOC':
        return <FileText className="h-5 w-5 text-red-600" />;
      case 'XLS':
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case 'JPG':
        return <FileImage className="h-5 w-5 text-purple-600" />;
      default:
        return <BarChart className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF':
        return 'bg-blue-100 text-blue-800';
      case 'DOC':
        return 'bg-red-100 text-red-800';
      case 'XLS':
        return 'bg-green-100 text-green-800';
      case 'JPG':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proyek
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <TableRow 
                key={doc.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleDocumentClick(doc)}
              >
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{doc.project}</div>
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{doc.date}</div>
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(doc.type)}`}>
                    {doc.type}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedDocument && (
        <DocumentPreviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          document={selectedDocument}
        />
      )}
    </>
  );
}
