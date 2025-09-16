import React, { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface FileUploadProps {
  onFileUploaded: (fileName: string) => void;
}

export function FileUpload({ onFileUploaded }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      setSelectedFile(pdfFile);
      onFileUploaded(pdfFile.name);
    }
  }, [onFileUploaded]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      onFileUploaded(file.name);
    }
  }, [onFileUploaded]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-medium text-primary text-center">AI Dosen Penguji - Simulasi Seminar Proposal</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[rgba(238,245,255,1)]">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-xl">Selamat Datang!</h2>
            <p className="text-muted-foreground">
              Unggah proposal Anda dalam format .pdf untuk memulai sesi.
            </p>
            <div className="w-full h-px bg-border"></div>
          </div>

          {/* Upload Area */}
          <Card 
            className={`p-12 border-2 border-dashed transition-colors cursor-pointer ${
              isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-lg">Seret & Lepas File PDF Anda di Sini</p>
                <p className="text-muted-foreground">atau</p>
              </div>

              <div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input">
                  <Button type="button" variant="outline" className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-2" />
                    Pilih File dari Komputer
                  </Button>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 text-sm">
                    File dipilih: {selectedFile.name}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <p>Sesi akan berjalan selama 30 menit setelah dimulai</p>
          </div>
        </div>
      </div>
    </div>
  );
}