import { BookOpenCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 text-primary", className)}>
      <BookOpenCheck className="h-8 w-8" />
      <span className="text-2xl font-bold tracking-tighter">Nomiko</span>
    </div>
  );
}
