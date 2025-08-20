
'use client';

import { useState } from 'react';
import { chat } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Send, User, Sparkles, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface ChatViewProps {
  documentContent: string;
}

export function ChatView({ documentContent }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chat({ documentText: documentContent, question: input });
      const aiMessage: ChatMessage = { sender: 'ai', text: result.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (e) {
      const err = e instanceof Error ? e.message : "An unknown error occurred.";
      toast({
        variant: 'destructive',
        title: 'Chat Failed',
        description: err,
      });
       // Restore user message to input if AI fails
       const lastMessage = messages[messages.length];
       if(lastMessage.sender === 'user') {
         setInput(lastMessage.text);
         setMessages(prev => prev.slice(0, prev.length -1));
       }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare />
          Chat Assistant
        </CardTitle>
        <CardDescription>
          Ask questions about your document and get instant, AI-powered answers.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col overflow-hidden">
        <ScrollArea className="flex-grow mb-4 pr-4">
            <div className="space-y-4">
            {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                {message.sender === 'ai' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Sparkles className="h-5 w-5" />
                    </div>
                )}
                <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.sender === 'user' 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'bg-primary/10 text-foreground'
                }`}>
                    <p className="text-sm">{message.text}</p>
                </div>
                {message.sender === 'user' && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <User className="h-5 w-5" />
                    </div>
                )}
                </div>
            ))}
            {isLoading && (
                 <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                    <div className="rounded-lg px-4 py-2 bg-primary/10 text-foreground">
                        <p className="text-sm">Thinking...</p>
                    </div>
                </div>
            )}
            </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="e.g., What are the payment terms?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
