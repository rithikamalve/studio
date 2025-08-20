
'use client';

import { useState, useEffect } from 'react';
import { summarizeClauses } from '@/lib/actions';
import { type SummarizeClausesOutput } from '@/ai/flows/clause-by-clause-summary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, BookText, Sparkles } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface SummaryViewProps {
  documentContent: string;
}

export function SummaryView({ documentContent }: SummaryViewProps) {
  const [result, setResult] = useState<SummarizeClausesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function getSummary() {
      setIsLoading(true);
      setError(null);
      try {
        const summaryResult = await summarizeClauses({ documentText: documentContent });
        setResult(summaryResult);
      } catch (e) {
        const err = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(err);
        toast({
          variant: 'destructive',
          title: 'Summarization Failed',
          description: err,
        });
      } finally {
        setIsLoading(false);
      }
    }
    getSummary();
  }, [documentContent, toast]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookText />
          Clause-by-Clause Summary
        </CardTitle>
        <CardDescription>
          Here is a plain English summary of each clause in your document, powered by AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
        {isLoading && (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2 rounded-md border p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            ))}
        </div>
        )}
        {error && (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
        )}
        {!isLoading && !error && result && (
        <Accordion type="single" collapsible className="w-full">
            {result.clauseSummaries.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                <span className="text-left">Clause {index + 1}</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                <div>
                    <h4 className="font-semibold text-muted-foreground mb-2">Original Clause</h4>
                    <p className="text-sm">{item.clause}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-primary mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" />
                    AI Summary
                    </h4>
                    <p className="text-sm text-foreground/90">
                    {item.summary || 'No summary available.'}
                    </p>
                </div>
                </AccordionContent>
            </AccordionItem>
            ))}
        </Accordion>
        )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
