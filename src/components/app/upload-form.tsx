'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecentDocuments } from '@/hooks/use-recent-documents';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Sparkles } from 'lucide-react';

export function UploadForm() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addDocument } = useRecentDocuments();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Document",
        description: "Please paste some text to analyze.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const newDoc = addDocument(text);
      toast({
        title: "Document Added",
        description: "Your document is ready for analysis.",
      });
      router.push(`/dashboard?docId=${newDoc.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save the document. Please try again.",
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
          Paste your document text into the field below to begin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Paste your legal document, terms of service, or any other text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Analyze Document'}
            <Sparkles />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
