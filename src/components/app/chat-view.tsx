'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface ChatViewProps {
  documentContent: string;
}

export function ChatView({ documentContent }: ChatViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare />
          Chat Assistant
        </CardTitle>
        <CardDescription>
          Ask questions about your document in a conversational way. This feature is coming soon!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border-2 border-dashed text-center p-8">
            <p className="text-muted-foreground">The chat assistant is under construction.</p>
        </div>
      </CardContent>
    </Card>
  );
}
