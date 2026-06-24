"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "../ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span>GPA Analyzer</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
        </nav>
        <Button size="sm">
          <Link href="/upload">Upload Transcript</Link>
        </Button>
      </div>
    </header>
  );
}