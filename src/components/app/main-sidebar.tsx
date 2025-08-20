'use client'

import { useRecentDocuments } from "@/hooks/use-recent-documents";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { Logo } from "./logo";
import { Button } from "../ui/button";
import { FileText, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

export function MainSidebar() {
    const { documents, deleteDocument } = useRecentDocuments();
    const searchParams = useSearchParams();
    const activeDocId = searchParams.get('docId');

    const handleDelete = (e: React.MouseEvent, docId: string) => {
        e.preventDefault();
        e.stopPropagation();
        deleteDocument(docId);
    }

    return (
        <Sidebar collapsible="icon" className="border-r">
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <div className="p-2">
                     <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/">
                            <PlusCircle />
                            <span>New Document</span>
                        </Link>
                    </Button>
                </div>
                <div className="p-2 pt-0">
                    <p className="p-2 text-xs font-medium text-muted-foreground">Recent Documents</p>
                    <ScrollArea className="h-[calc(100vh-200px)]">
                        <SidebarMenu>
                            {documents.map(doc => (
                                <SidebarMenuItem key={doc.id} className="group/menu-item">
                                    <Link href={`/dashboard?docId=${doc.id}`} className="block">
                                        <SidebarMenuButton tooltip={doc.name} isActive={activeDocId === doc.id}>
                                            <FileText />
                                            <span className="truncate">{doc.name}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover/menu-item:opacity-100 group-data-[collapsible=icon]:hidden"
                                      onClick={(e) => handleDelete(e, doc.id)}
                                      aria-label="Delete document"
                                    >
                                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                    </Button>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </ScrollArea>
                </div>
            </SidebarContent>
            <SidebarFooter>
                {/* Future elements can go here */}
            </SidebarFooter>
        </Sidebar>
    )
}
