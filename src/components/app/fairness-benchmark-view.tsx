
'use client';

import { useState, useEffect } from 'react';
import { benchmarkFairness } from '@/lib/actions';
import { type FairnessBenchmarkOutput } from '@/ai/flows/fairness-benchmark';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

interface FairnessBenchmarkViewProps {
  documentContent: string;
}

const severityConfig = {
    High: {
        icon: ShieldAlert,
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/50'
    },
    Medium: {
        icon: ShieldQuestion,
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/50'
    },
    Low: {
        icon: ShieldCheck,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/50'
    }
}

export function FairnessBenchmarkView({ documentContent }: FairnessBenchmarkViewProps) {
  const [result, setResult] = useState<FairnessBenchmarkOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function getBenchmark() {
      setIsLoading(true);
      setError(null);
      try {
        const benchmarkResult = await benchmarkFairness({ documentText: documentContent });
        setResult(benchmarkResult);
      } catch (e) {
        const err = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(err);
        toast({
          variant: 'destructive',
          title: 'Fairness Benchmark Failed',
          description: err,
        });
      } finally {
        setIsLoading(false);
      }
    }
    getBenchmark();
  }, [documentContent, toast]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield />
          Fairness Benchmark
        </CardTitle>
        <CardDescription>
            AI-powered analysis of your document compared to common Indian legal standards.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
        {isLoading && (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
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
        result.benchmarks.length > 0 ? (
            <Accordion type="multiple" className="w-full space-y-2">
            {result.benchmarks.map((item, index) => {
            const config = severityConfig[item.severity] || severityConfig.Medium;
            const Icon = config.icon;
            return (
                <AccordionItem value={`item-${index}`} key={index} className={cn("rounded-lg border px-4", config.borderColor, config.bgColor)}>
                    <AccordionTrigger className="py-3 text-left hover:no-underline">
                        <div className="flex items-center gap-3">
                            <Icon className={cn("h-6 w-6 shrink-0", config.color)} />
                            <span className="font-semibold">{`Flagged Clause (Severity: ${item.severity})`}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                    <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Original Clause</h4>
                        <p className="text-sm font-mono bg-background/50 p-2 rounded-md">{item.clause}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-primary mb-2">AI Analysis</h4>
                        <p className="text-sm text-foreground/90">{item.reason}</p>
                    </div>
                    </AccordionContent>
                </AccordionItem>
            )
            })}
        </Accordion>
        ) : (
            <div className="rounded-md border-2 border-dashed text-center p-8 flex flex-col items-center">
                <ShieldCheck className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="font-semibold text-lg">No Fairness Issues Detected</h3>
                <p className="text-muted-foreground">Our AI analysis did not find any clauses that deviate significantly from standard Indian practices.</p>
            </div>
        )
        )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
