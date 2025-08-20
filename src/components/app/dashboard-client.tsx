
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecentDocuments } from '@/hooks/use-recent-documents';
import { type Document } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SummaryView } from './summary-view';
import { QAndAView } from './q-and-a-view';
import { GlossaryView } from './glossary-view';
import { AlertTriangle, FileText } from 'lucide-react';
import { ChatView } from './chat-view';
import { DocumentViewer } from './document-viewer';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { FairnessBenchmarkView } from './fairness-benchmark-view';

export function DashboardClient() {
  const searchParams = useSearchParams();
  const { getDocument } = useRecentDocuments();
  const [document, setDocument] = useState<Document | null | undefined>(undefined);

  useEffect(() => {
    const docId = searchParams.get('docId');
    if (docId) {
      const foundDocument = getDocument(docId);
      setDocument(foundDocument);
    } else {
      setDocument(null);
    }
  }, [searchParams, getDocument]);

  if (document === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading Document...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please wait while we load your document.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                <AlertTriangle className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
            </div>
            <CardTitle>No Document Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please select a document from the sidebar or upload a new one to begin analysis.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
        <div className="p-4 sm:p-6 md:p-8 md:pb-4">
            <h1 className="font-headline text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
                <FileText className="h-7 w-7 text-primary" />
                <span>{document.name}</span>
            </h1>
            <p className="text-muted-foreground">
                Analyzed on {new Date(document.createdAt).toLocaleDateString()}
            </p>
        </div>

        <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border-t">
            <ResizablePanel defaultSize={50}>
                <DocumentViewer document={document} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
                <div className="h-full flex flex-col p-4 sm:p-6 md:p-8 overflow-hidden">
                    <Tabs defaultValue="summary" className="w-full flex-grow flex flex-col">
                        <TabsList>
                        <TabsTrigger value="summary">Clause Summary</TabsTrigger>
                        <TabsTrigger value="qna">Reverse Q&A</TabsTrigger>
                        <TabsTrigger value="glossary">Glossary</TabsTrigger>
                        <TabsTrigger value="fairness">Fairness</TabsTrigger>
                        <TabsTrigger value="chat">Chat</TabsTrigger>
                        </TabsList>
                        <TabsContent value="summary" className="mt-4 flex-grow overflow-y-auto">
                            <SummaryView documentContent={document.content} />
                        </TabsContent>
                        <TabsContent value="qna" className="mt-4 flex-grow overflow-y-auto">
                            <QAndAView documentContent={document.content} />
                        </TabsContent>
                        <TabsContent value="glossary" className="mt-4 flex-grow overflow-y-auto">
                            <GlossaryView documentContent={document.content} />
                        </TabsContent>
                        <TabsContent value="fairness" className="mt-4 flex-grow overflow-y-auto">
                            <FairnessBenchmarkView documentContent={document.content} />
                        </TabsContent>
                        <TabsContent value="chat" className="mt-4 flex-grow overflow-y-auto">
                            <ChatView documentContent={document.content} />
                        </TabsContent>
                    </Tabs>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    </div>
  );
}
