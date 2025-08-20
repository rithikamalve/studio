import { MainSidebar } from "@/components/app/main-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <MainSidebar />
        <SidebarInset>
            <Suspense>
                {children}
            </Suspense>
        </SidebarInset>
    </SidebarProvider>
  );
}
