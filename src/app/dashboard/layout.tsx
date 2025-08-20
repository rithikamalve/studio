import { MainSidebar } from "@/components/app/main-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <MainSidebar />
        <SidebarInset>
            {children}
        </SidebarInset>
    </SidebarProvider>
  );
}
