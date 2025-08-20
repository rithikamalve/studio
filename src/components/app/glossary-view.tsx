
'use client';

import { useState, useEffect, useRef } from 'react';
import { generateGlossary, textToSpeech } from '@/lib/actions';
import { type GlossaryGenerationOutput } from '@/ai/flows/glossary-generation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertTriangle, List, Sparkles, Volume2, Loader2, StopCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

interface GlossaryViewProps {
  documentContent: string;
}

export function GlossaryView({ documentContent }: GlossaryViewProps) {
  const [glossary, setGlossary] = useState<GlossaryGenerationOutput>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [speakingTerm, setSpeakingTerm] = useState<string | null>(null);
  const [isSpeakingLoading, setIsSpeakingLoading] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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
    
    // Cleanup audio on unmount
    return () => {
        if(audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    }
  }, [documentContent, toast]);

  const handleSpeak = async (term: string, definition: string) => {
    // If another term is currently playing, stop it.
    if(audioRef.current) {
        audioRef.current.pause();
        if (speakingTerm === term) {
            setSpeakingTerm(null);
            return;
        }
    }

    setSpeakingTerm(null);
    setIsSpeakingLoading(term);

    try {
        const textToSpeak = `${term}. ${definition}`;
        const { audioDataUri } = await textToSpeech({ text: textToSpeak });
        
        audioRef.current = new Audio(audioDataUri);
        audioRef.current.play();
        setSpeakingTerm(term);

        audioRef.current.onended = () => {
            setSpeakingTerm(null);
            audioRef.current = null;
        }
        audioRef.current.onerror = () => {
            toast({
                variant: 'destructive',
                title: 'Playback Error',
                description: 'Could not play the audio.',
            });
            setSpeakingTerm(null);
            audioRef.current = null;
        }

    } catch (e) {
        const err = e instanceof Error ? e.message : "An unknown error occurred.";
        toast({
            variant: "destructive",
            title: "Text-to-Speech Failed",
            description: err,
        })
    } finally {
        setIsSpeakingLoading(null);
    }
  };
  
  const getIconForTerm = (term: string) => {
    if (isSpeakingLoading === term) {
        return <Loader2 className="h-5 w-5 animate-spin" />;
    }
    if (speakingTerm === term) {
        return <StopCircle className="h-5 w-5 text-accent" />;
    }
    return <Volume2 className="h-5 w-5" />;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List />
          AI-Generated Glossary
        </CardTitle>
        <CardDescription>
          Key terms from your document, defined by AI. Click the speaker icon to listen.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <ScrollArea className="h-full pr-4">
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
                                    onClick={() => handleSpeak(entry.term, entry.definition)}
                                    className="shrink-0"
                                    aria-label={`Listen to definition for ${entry.term}`}
                                    disabled={!!isSpeakingLoading}
                                >
                                    {getIconForTerm(entry.term)}
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
