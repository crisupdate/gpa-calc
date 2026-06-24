import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <GraduationCap className="h-4 w-4 text-primary" />
          GPA Analyzer
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Built by Cristian Casu. Your transcripts are never stored.
        </p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}