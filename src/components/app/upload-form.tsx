'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRecentDocuments } from '@/hooks/use-recent-documents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Loader2, Sparkles, X } from 'lucide-react';
import { ocr } from '@/lib/actions';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const { addDocument } = useRecentDocuments();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
        if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
            toast({
              variant: "destructive",
              title: "File too large",
              description: `Please select a file smaller than ${MAX_FILE_SIZE_MB}MB.`,
            });
            return;
        }
        if (!SUPPORTED_IMAGE_TYPES.includes(selectedFile.type)) {
            toast({
                variant: "destructive",
                title: "Unsupported file type",
                description: "Please select a JPEG, PNG, or WebP image.",
            });
            return;
        }
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
        handleFileChange(droppedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        variant: "destructive",
        title: "No Document",
        description: "Please upload a document to analyze.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
            const ocrResult = await ocr({ documentDataUri: base64data });
            const newDoc = addDocument(ocrResult.text, file.name);
            toast({
                title: "Analysis Complete",
                description: "Your document has been processed and is ready.",
            });
            router.push(`/dashboard?docId=${newDoc.id}`);
        } catch (error) {
             toast({
                variant: "destructive",
                title: "OCR Failed",
                description: error instanceof Error ? error.message : "Could not process the document. Please try again with a clearer image.",
            });
            setIsLoading(false);
        }
      }
      reader.onerror = () => {
        throw new Error("Failed to read file.");
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-6 w-6" />
          <span>Upload Document</span>
        </CardTitle>
        <CardDescription>
          Drag & drop your document image or click to select a file.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div 
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors",
                    isDragging && "border-primary bg-primary/10"
                )}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                {previewUrl ? (
                    <>
                        <Image src={previewUrl} alt="Document preview" layout="fill" objectFit="contain" className="p-2 rounded-lg" />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 z-10 h-7 w-7"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile();
                            }}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove file</span>
                        </Button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <FileUp className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (max {MAX_FILE_SIZE_MB}MB)</p>
                    </div>
                )}
                <input 
                    ref={fileInputRef}
                    id="dropzone-file" 
                    type="file" 
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                    accept={SUPPORTED_IMAGE_TYPES.join(',')}
                    disabled={isLoading}
                />
            </div>
          <Button type="submit" className="w-full" disabled={isLoading || !file}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
                <>
                    Analyze Document
                    <Sparkles />
                </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
