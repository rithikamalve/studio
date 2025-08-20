'use client';

import { useState, useEffect } from 'react';
import { generateGlossary } from '@/lib/actions';
import { type GlossaryGenerationOutput } from '@/ai/flows/glossary-generation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, List, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface GlossaryViewProps {
  documentContent: string;
}

export function GlossaryView({ documentContent }: GlossaryViewProps) {
  const [glossary, setGlossary] = useState<GlossaryGenerationOutput>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speakingTerm, setSpeakingTerm] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function getGlossary() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateGlossary({ documentText: documentContent });
        setGlossary(result);
      } catch (e) {
        const err = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(err);
        toast({
          variant: 'destructive',
          title: 'Glossary Generation Failed',
          description: err,
        });
      } finally {
        setIsLoading(false);
      }
    }
    getGlossary();
  }, [documentContent, toast]);

  const speak = (term: string, definition: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            if (speakingTerm === term) {
                setSpeakingTerm(null);
                return;
            }
        }
      const textToSpeak = `${term}. ${definition}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onstart = () => setSpeakingTerm(term);
      utterance.onend = () => setSpeakingTerm(null);
      utterance.onerror = () => setSpeakingTerm(null);
      window.speechSynthesis.speak(utterance);
    } else {
        toast({
            variant: "destructive",
            title: "Unsupported Feature",
            description: "Your browser does not support text-to-speech.",
        })
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List />
          AI-Generated Glossary
        </CardTitle>
        <CardDescription>
          Key terms from your document, defined by AI. Click the speaker icon to listen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
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
        {!isLoading && !error && (
            glossary.length > 0 ? (
                <ul className="space-y-4">
                    {glossary.map((entry, index) => (
                        <li key={index}>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h4 className="font-semibold text-primary flex items-center gap-1.5">
                                        <Sparkles className="h-4 w-4" />
                                        {entry.term}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">{entry.definition}</p>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => speak(entry.term, entry.definition)}
                                    className="shrink-0"
                                    aria-label={`Listen to definition for ${entry.term}`}
                                >
                                    <Volume2 className={`h-5 w-5 ${speakingTerm === entry.term ? 'text-accent' : ''}`} />
                                </Button>
                            </div>
                            {index < glossary.length - 1 && <Separator className="mt-4" />}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="rounded-md border-2 border-dashed text-center p-8">
                  <p className="text-muted-foreground">No legal terms were identified for a glossary.</p>
                </div>
            )
        )}
      </CardContent>
    </Card>
  );
}
