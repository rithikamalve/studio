'use client'

import { Document } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { FileText } from "lucide-react";

interface DocumentViewerProps {
    document: Document;
}

const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function DocumentViewer({ document }: DocumentViewerProps) {
    const isImage = SUPPORTED_IMAGE_TYPES.includes(document.fileType);

    return (
        <div className="h-full p-4 sm:p-6 md:p-8 flex flex-col">
            <Card className="flex-grow flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText />
                        Original Document
                    </CardTitle>
                    <CardDescription>
                        This is the original document you uploaded.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                    <ScrollArea className="h-full">
                        {isImage && document.dataUri ? (
                             <div className="relative w-full h-full min-h-[50vh]">
                                <Image src={document.dataUri} alt="Document preview" layout="fill" objectFit="contain" />
                            </div>
                        ) : (
                            <pre className="text-sm whitespace-pre-wrap font-body">
                                {document.content}
                            </pre>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
