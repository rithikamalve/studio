
'use client';

import { useState, useEffect } from 'react';
import { detectContradictions } from '@/lib/actions';
import { type ContradictionDetectionOutput } from '@/ai/flows/contradiction-detection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, LandPlot, Sparkles, GitPullRequestArrow, CheckCircle2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { ScrollArea } from '../ui/scroll-area';

interface ContradictionViewProps {
  documentContent: string;
}

export function ContradictionView({ documentContent }: ContradictionViewProps) {
  const [result, setResult] = useState<ContradictionDetectionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function getContradictions() {
      setIsLoading(true);
      setError(null);
      try {
        const detectionResult = await detectContradictions({ documentText: documentContent });
        setResult(detectionResult);
      } catch (e) {
        const err = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(err);
        toast({
          variant: 'destructive',
          title: 'Contradiction Detection Failed',
          description: err,
        });
      } finally {
        setIsLoading(false);
      }
    }
    getContradictions();
  }, [documentContent, toast]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitPullRequestArrow />
          Contradiction Detection
        </CardTitle>
        <CardDescription>
            AI-powered analysis to find conflicting clauses in your document.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
        {isLoading && (
        <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2 rounded-md border p-4">
                <Skeleton className="h-4 w-1/4" />
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
        result.contradictions.length > 0 ? (
            <Accordion type="multiple" className="w-full space-y-4">
            {result.contradictions.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="rounded-lg border border-destructive/50 bg-destructive/10 px-4">
                    <AccordionTrigger className="py-3 text-left hover:no-underline">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-6 w-6 shrink-0 text-destructive" />
                            <span className="font-semibold">{`Contradiction ${index + 1}`}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-md bg-background/50 p-3">
                                <h4 className="font-semibold text-muted-foreground mb-2">Clause A</h4>
                                <p className="text-sm font-mono">{item.contradictoryClauses[0]}</p>
                            </div>
                            <div className="rounded-md bg-background/50 p-3">
                                <h4 className="font-semibold text-muted-foreground mb-2">Clause B</h4>
                                <p className="text-sm font-mono">{item.contradictoryClauses[1]}</p>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-primary mb-2 flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4" />
                                AI Explanation
                            </h4>
                            <p className="text-sm text-foreground/90">{item.explanation}</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
        ) : (
            <div className="rounded-md border-2 border-dashed text-center p-8 flex flex-col items-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="font-semibold text-lg">No Contradictions Found</h3>
                <p className="text-muted-foreground">Our AI analysis did not find any contradictory clauses in your document.</p>
            </div>
        )
        )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
