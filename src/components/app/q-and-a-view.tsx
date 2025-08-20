
'use client';

import { useState } from 'react';
import { reverseQAndA } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, HelpCircle, Loader2, Search, Sparkles } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface QAndAViewProps {
  documentContent: string;
}

export function QAndAView({ documentContent }: QAndAViewProps) {
  const [question, setQuestion] = useState('');
  const [relevantClauses, setRelevantClauses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const result = await reverseQAndA({ documentText: documentContent, question });
      setRelevantClauses(result.relevantClauses);
    } catch (e) {
      const err = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(err);
      toast({
        variant: 'destructive',
        title: 'Q&A Failed',
        description: err,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle />
          Reverse Q&A
        </CardTitle>
        <CardDescription>
          Ask a question about your document, and our AI will find the relevant clauses for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <Input
            placeholder="e.g., What are the terms of termination?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !question.trim()}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
            <span className="sr-only">Ask Question</span>
          </Button>
        </form>

        <ScrollArea className="flex-grow pr-4">
          <div className="space-y-4">
          {isLoading && (
              <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
              </div>
          )}
          {error && (
              <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}
          {!isLoading && !error && hasSearched && (
              <>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="text-primary" />
                  Relevant Clauses
              </h3>
              {relevantClauses.length > 0 ? (
                  relevantClauses.map((clause, index) => (
                  <div key={index} className="rounded-md border bg-secondary/30 p-4 text-sm">
                      <p>{clause}</p>
                  </div>
                  ))
              ) : (
                  <div className="rounded-md border-2 border-dashed text-center p-8">
                  <p className="text-muted-foreground">No relevant clauses found for your question.</p>
                  </div>
              )}
              </>
          )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
